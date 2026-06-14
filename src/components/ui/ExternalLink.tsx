import { externalAnchorProps, type ExternalLinkProps } from '../../lib/links'

export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <a {...externalAnchorProps(href)} {...rest}>
      {children}
    </a>
  )
}
