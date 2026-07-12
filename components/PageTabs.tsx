export function PageTabs<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto">
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`relative py-3.5 text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
              <span
                className={`absolute left-0 right-0 -bottom-px h-[3px] bg-club transition-transform origin-left duration-200 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
