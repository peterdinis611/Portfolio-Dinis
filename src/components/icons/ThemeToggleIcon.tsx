type ThemeToggleIconProps = {
  theme: 'light' | 'dark'
}

export function ThemeToggleIcon({ theme }: ThemeToggleIconProps) {
  if (theme === 'dark') {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden focusable="false">
        <title>Sun</title>
        <circle cx="12" cy="12" r="4.25" fill="#F5B942" />
        <g fill="#F5B942">
          <rect x="11.1" y="2.5" width="1.8" height="3.2" rx="0.9" />
          <rect x="11.1" y="18.3" width="1.8" height="3.2" rx="0.9" />
          <rect x="2.5" y="11.1" width="3.2" height="1.8" rx="0.9" />
          <rect x="18.3" y="11.1" width="3.2" height="1.8" rx="0.9" />
        </g>
        <g fill="#FF8F5C">
          <rect x="5.4" y="5.4" width="2.2" height="2.2" rx="1.1" transform="rotate(-45 6.5 6.5)" />
          <rect
            x="16.4"
            y="16.4"
            width="2.2"
            height="2.2"
            rx="1.1"
            transform="rotate(-45 17.5 17.5)"
          />
        </g>
        <g fill="#FFD166">
          <rect
            x="16.4"
            y="5.4"
            width="2.2"
            height="2.2"
            rx="1.1"
            transform="rotate(45 17.5 6.5)"
          />
          <rect
            x="5.4"
            y="16.4"
            width="2.2"
            height="2.2"
            rx="1.1"
            transform="rotate(45 6.5 17.5)"
          />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden focusable="false">
      <title>Moon</title>
      <path
        fill="currentColor"
        d="M21 14.5A7.5 7.5 0 019.5 3 6.5 6.5 0 0014.5 21 7.5 7.5 0 0021 14.5z"
      />
    </svg>
  )
}
