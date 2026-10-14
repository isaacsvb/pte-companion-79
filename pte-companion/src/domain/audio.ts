// Wrapper getUserMedia/MediaRecorder: grava a voz e gera objectURL para playback.
// Gravações são efêmeras (não persistidas). Degrada quando sem suporte/permissão.

export type AudioSupport = 'supported' | 'unsupported';

export interface RecordingResult {
  blob: Blob;
  url: string;
}

/** Verifica se o navegador suporta gravação de áudio. */
export function isAudioSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined'
  );
}

export class AudioRecorderController {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];

  get isRecording(): boolean {
    return this.recorder?.state === 'recording';
  }

  /**
   * Solicita o microfone e inicia a gravação.
   * Lança Error quando sem suporte ou permissão negada (a UI trata a degradação).
   */
  async start(): Promise<void> {
    if (!isAudioSupported()) {
      throw new Error('unsupported');
    }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start();
  }

  /** Para a gravação e resolve com o blob + objectURL para playback. */
  stop(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('not-recording'));
        return;
      }
      const recorder = this.recorder;
      recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        this.releaseStream();
        resolve({ blob, url });
      };
      recorder.stop();
    });
  }

  private releaseStream(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.recorder = null;
  }

  /** Cancela e libera recursos sem produzir resultado. */
  cancel(): void {
    try {
      if (this.recorder && this.recorder.state !== 'inactive') this.recorder.stop();
    } catch {
      // ignora
    }
    this.releaseStream();
  }
}
