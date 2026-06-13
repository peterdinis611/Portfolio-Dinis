import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useCallback,
} from 'react'
import { openMailto, type MailtoOptions } from '../../lib/email'

type MailtoLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'onClick'> & {
  mailto?: MailtoOptions
  onNavigate?: () => void
  children: ReactNode
}

export function MailtoLink({ mailto, onNavigate, children, ...rest }: MailtoLinkProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      onNavigate?.()
      openMailto(mailto)
    },
    [mailto, onNavigate],
  )

  return (
    <a {...rest} href="#" onClick={handleClick} rel="nofollow noopener">
      {children}
    </a>
  )
}
