import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  className?: string;
  wordmark?: boolean;
}

/** The three soft shapes of Colorful's open C, without a container background. */
export function BrandLogo({ className = '', wordmark = true }: BrandLogoProps) {
  return (
    <span
      className={cn("brand-logo inline-flex items-center gap-[0.45em] whitespace-nowrap", className)}
      role="img"
      aria-label="Colorful."
    >
      <svg
        className="brand-logo__mark size-8 shrink-0"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M25.2 6.4C22.9 3.9 19.9 2.5 16.3 2.5C8.4 2.5 2.8 8.2 2.8 16C2.8 23.8 8.4 29.5 16.3 29.5C20 29.5 23 28.2 25.3 25.6C27 23.7 26.9 21.1 25.1 19.7C23.5 18.4 21.5 18.8 20 20.3C19 21.4 17.8 22 16.2 22C12.8 22 10.5 19.5 10.5 16C10.5 12.4 12.8 10 16.2 10C17.8 10 19.1 10.6 20.3 11.8C21.9 13.3 24.1 13.4 25.6 11.8C27.1 10.3 26.8 8.1 25.2 6.4Z" fill="#9A79C6" stroke="none" />
        <path d="M8.2 5.1C10.4 3.4 13.2 2.5 16.3 2.5C19.9 2.5 22.9 3.9 25.2 6.4C26.8 8.1 27.1 10.3 25.6 11.8C24.1 13.4 21.9 13.3 20.3 11.8C19.1 10.6 17.8 10 16.2 10C14.5 10 13.1 10.6 12.1 11.7C10.5 13.3 7.8 12.4 7.1 10.4C6.4 8.4 6.9 6.1 8.2 5.1Z" fill="#D9C9ED" stroke="none" />
        <path d="M12.1 20.3C13.1 21.4 14.5 22 16.2 22C17.8 22 19 21.4 20 20.3C21.5 18.8 23.5 18.4 25.1 19.7C26.9 21.1 27 23.7 25.3 25.6C23 28.2 20 29.5 16.3 29.5C13.2 29.5 10.4 28.6 8.2 26.9C6.9 25.9 6.4 23.6 7.1 21.6C7.8 19.6 10.5 18.7 12.1 20.3Z" fill="#F2BEA7" stroke="none" />
      </svg>
      {wordmark && (
        <span aria-hidden="true" className="brand-logo__wordmark" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1 }}>
          Colorful<span style={{ color: '#9A79C6' }}>.</span>
        </span>
      )}
    </span>
  );
}
