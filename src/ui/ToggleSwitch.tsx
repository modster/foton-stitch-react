interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "primary" | "tertiary";
}

export function ToggleSwitch({
  checked,
  onChange,
  color = "primary",
}: ToggleSwitchProps) {
  const activeBg = color === "tertiary" ? "bg-tertiary" : "bg-primary";

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${checked ? activeBg : ""}`}
      />
    </label>
  );
}
