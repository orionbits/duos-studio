type AudioPlayerProps = {
  audio_track: string;
};

export function AudioPlayer({ audio_track }: AudioPlayerProps) {
  if (!audio_track) {
    return null;
  }

  return (
    <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4">
      <p className="mb-2 text-sm font-medium text-slate-700">Audio track: {audio_track}</p>
      <audio controls className="w-full">
        <source src={audio_track} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
