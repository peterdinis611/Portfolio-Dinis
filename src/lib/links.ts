import type { AnchorHTMLAttributes, ReactNode } from 'react'

export function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function externalAnchorProps(
  href: string,
): Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> {
  if (isHttpUrl(href)) {
    return { href, target: '_blank', rel: 'noopener noreferrer' }
  }

  return { href }
}

export type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  children: ReactNode
}
