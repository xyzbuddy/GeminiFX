import { useId } from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Native checkbox with role="switch" so keyboard and screen readers work without extra code. */
export function Toggle({ label, checked, onChange }: ToggleProps) {
  const id = useId();
  return (
    <div className="gfx-toggle">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    </div>
  );
}
