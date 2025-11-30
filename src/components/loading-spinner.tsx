type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

type LoadingSpinnerProps = {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Border thickness: 2, 4, or 8 */
  thickness?: 2 | 4 | 8;
  /** Optional accessible label (screen readers) */
  label?: string;
  /** Additional classes to style color or layout */
  className?: string;
  /** Direct color override (CSS color string, e.g. "#22c55e" or "rebeccapurple") */
  color?: string;
  /** If true, covers the screen with a dim backdrop */
  overlay?: boolean;
};

const sizeMap: Record<SpinnerSize, string> = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const thicknessMap: Record<2 | 4 | 8, string> = {
  2: "border-2",
  4: "border-4",
  8: "border-8",
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A simple circular spinner that adapts to light & dark themes via currentColor.
 * Control the color by passing `colorClass` (e.g. text-primary) or overriding with `className`.
 */
export default function LoadingSpinner({
  size = "md",
  thickness = 4,
  label = "Loading…",
  className,
  color,
  overlay = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cx(
        "inline-flex items-center justify-center",
        // Inherit color from parent; set sensible defaults for both themes
        // Parent can override with e.g. text-primary
        "text-neutral-800 dark:text-neutral-200",
        className
      )}
      style={color ? { color } : undefined}
    >
      <div
        className={cx(
          "animate-spin rounded-full border-current border-t-transparent",
          sizeMap[size],
          thicknessMap[thickness]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div
      className={cx(
        "fixed inset-0 z-50 grid place-items-center",
        // Subtle backdrop that adapts to theme
        "bg-white/60 dark:bg-black/60 backdrop-blur-[1px]"
      )}
    >
      {spinner}
    </div>
  );
}

// Usage examples:
// <LoadingSpinner />
// <LoadingSpinner size="lg" thickness={8} className="text-blue-500" />
// <LoadingSpinner color="#22c55e" />
// <LoadingSpinner overlay />
