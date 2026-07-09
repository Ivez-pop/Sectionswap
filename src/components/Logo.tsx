import Image from "next/image";

const sizeMap = {
  xs: 20,
  sm: 30,
  md: 40,
  lg: 52,
} as const;

export default function Logo({
  size = "sm",
  className,
}: {
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const px = sizeMap[size];
  return (
    <Image
      src="/logo/logo.jpeg"
      alt="KIIT Hub"
      width={px}
      height={px}
      priority
      quality={100}
      className={`shrink-0 rounded-[28%] object-cover ${className ?? ""}`}
    />
  );
}
