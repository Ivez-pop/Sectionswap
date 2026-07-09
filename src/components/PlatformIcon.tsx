import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export default function PlatformIcon({
  platform,
  size = 40,
  className,
}: PlatformIconProps) {
  const isWhatsApp = platform.trim().toLowerCase() === "whatsapp";
  const abbr = isWhatsApp ? "WA" : "DC";
  const color = isWhatsApp ? "var(--kh-wa)" : "var(--kh-dc)";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] font-mono text-xs font-extrabold text-white",
        className,
      )}
      style={{ width: size, height: size, background: color }}
    >
      {abbr}
    </div>
  );
}
