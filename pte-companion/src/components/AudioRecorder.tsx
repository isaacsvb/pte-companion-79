import { useRef, useState } from 'react';
import { AudioRecorderController, isAudioSupported } from '../domain/audio';
import { UI } from '../ui/strings';

export function AudioRecorder() {
  const controllerRef = useRef<AudioRecorderController | null>(null);
  const [recording, setRecording] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supported = isAudioSupported();

  async function handleStart() {
    setError(null);
    const controller = new AudioRecorderController();
    controllerRef.current = controller;
    try {
      await controller.start();
      setRecording(true);
    } catch {
      setError(UI.trainer.micDenied);
      setRecording(false);
    }
  }

  async function handleStop() {
    const controller = controllerRef.current;
    if (!controller) return;
    try {
      const result = await controller.stop();
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
      setPlaybackUrl(result.url);
    } catch {
      setError(UI.trainer.micDenied);
    } finally {
      setRecording(false);
    }
  }

  if (!supported) {
    return <p className="notice">{UI.trainer.micDenied}</p>;
  }

  return (
    <div>
      <p className="badge">{UI.trainer.recordingEphemeral}</p>
      <div className="row">
        {!recording ? (
          <button className="primary" onClick={handleStart}>
            ● Gravar voz
          </button>
        ) : (
          <button className="danger" onClick={handleStop}>
            ■ {UI.common.stop} ({UI.trainer.recording})
          </button>
        )}
      </div>
      {error && <p className="notice">{error}</p>}
      {playbackUrl && (
        <div style={{ marginTop: '0.5rem' }}>
          <p className="badge">{UI.trainer.playRecording}</p>
          <audio controls src={playbackUrl} />
        </div>
      )}
    </div>
  );
}
