interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "px-4 py-1.5 rounded-full bg-primary text-on-primary text-sm font-medium"
          : "px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-sm font-medium hover:text-on-surface"
      }
    >
      {label}
    </button>
  );
}
