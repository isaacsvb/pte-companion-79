import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioRecorderController, isAudioSupported } from './audio';

// Mock de MediaRecorder e getUserMedia.
class MockMediaRecorder {
  state: 'inactive' | 'recording' = 'inactive';
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  mimeType = 'audio/webm';
  constructor(public stream: MediaStream) {}
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    this.ondataavailable?.({ data: new Blob(['abc'], { type: 'audio/webm' }) });
    this.onstop?.();
  }
}

function installMocks(opts: { grant: boolean } = { grant: true }) {
  const track = { stop: vi.fn() };
  const stream = { getTracks: () => [track] } as unknown as MediaStream;
  (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = MockMediaRecorder;
  (globalThis.navigator as unknown as { mediaDevices: unknown }).mediaDevices = {
    getUserMedia: opts.grant
      ? vi.fn().mockResolvedValue(stream)
      : vi.fn().mockRejectedValue(new Error('denied')),
  };
  (globalThis as unknown as { URL: { createObjectURL: unknown; revokeObjectURL: unknown } }).URL.createObjectURL = vi
    .fn()
    .mockReturnValue('blob:mock-url');
}

describe('audio — gravação com MediaRecorder mockado', () => {
  beforeEach(() => {
    installMocks({ grant: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('detecta suporte quando as APIs existem', () => {
    expect(isAudioSupported()).toBe(true);
  });

  it('fluxo gravar → parar produz um blob e objectURL', async () => {
    const ctrl = new AudioRecorderController();
    await ctrl.start();
    expect(ctrl.isRecording).toBe(true);
    const result = await ctrl.stop();
    expect(result.url).toBe('blob:mock-url');
    expect(result.blob).toBeInstanceOf(Blob);
    expect(ctrl.isRecording).toBe(false);
  });

  it('lança erro quando a permissão é negada', async () => {
    installMocks({ grant: false });
    const ctrl = new AudioRecorderController();
    await expect(ctrl.start()).rejects.toThrow();
  });

  it('lança "unsupported" quando MediaRecorder não existe', async () => {
    (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = undefined;
    const ctrl = new AudioRecorderController();
    await expect(ctrl.start()).rejects.toThrow('unsupported');
  });
});
