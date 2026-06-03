type SiteLogoProps = {
  size?: "sm" | "md" | "lg" | "footer";
  showText?: boolean;
  tagline?: string;
  lightText?: boolean;
  /** White card behind logo — use on dark backgrounds (footer) */
  onDark?: boolean;
  className?: string;
};

const LOGO_HEIGHT = {
  sm: "h-10",
  md: "h-14",
  lg: "h-20",
  footer: "h-[4.25rem] max-w-[11rem]",
} as const;

export default function SiteLogo({
  size = "md",
  showText = false,
  tagline = "EDUCATION",
  lightText = false,
  onDark = false,
  className = "",
}: SiteLogoProps) {
  const titleClass = lightText ? "text-white" : "text-primary";

  const image = (
    <img
      src="/logo.jpeg"
      alt="V Five Education Consultancy"
      className={`${LOGO_HEIGHT[size]} w-auto object-contain flex-shrink-0`}
    />
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {onDark ? (
        <span className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-md shadow-black/20 ring-1 ring-slate-700/50">
          {image}
        </span>
      ) : (
        image
      )}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`text-xl font-extrabold font-title tracking-tight ${titleClass} ${size === "sm" ? "text-lg" : ""}`}>
            V FIVE
          </span>
          <span className={`text-[9px] font-bold text-accent tracking-[1.5px] uppercase ${size === "sm" ? "text-[8px] tracking-[1px]" : ""}`}>
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
}
