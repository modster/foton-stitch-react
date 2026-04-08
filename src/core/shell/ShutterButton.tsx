interface ShutterButtonProps {
  onCapture?: () => void;
  isRecording?: boolean;
}

export function ShutterButton({
  onCapture,
  isRecording = false,
}: ShutterButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center text-zinc-100 scale-125">
      {isRecording ? (
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-error flex items-center justify-center active:scale-90 transition-transform duration-200 border-4 border-black"
          style={{ boxShadow: "0 0 20px rgba(239,68,68,0.3)" }}
        >
          <span className="material-symbols-outlined text-white text-3xl">
            radio_button_checked
          </span>
        </button>
      ) : (
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full border-4 border-zinc-100 flex items-center justify-center active:scale-90 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-100" />
        </button>
      )}
    </div>
  );
}
