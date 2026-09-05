import { useState, type ImgHTMLAttributes } from "react";

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement>;

export default function ImageWithFallback({ alt, className, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div aria-label={alt} className={`${className ?? ""} bg-[#c9bbaa]`} role="img" />;
  }

  return <img {...props} alt={alt} className={className} onError={() => setFailed(true)} />;
}
