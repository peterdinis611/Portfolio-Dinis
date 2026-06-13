import { useSyncExternalStore } from 'react'
import { decodeEmail } from '../../lib/email'

function subscribe() {
  return () => {}
}

function getClientEmail() {
  return decodeEmail()
}

function getServerEmail() {
  return ''
}

type EmailDisplayProps = {
  className?: string
  placeholder?: string
}

export function EmailDisplay({ className, placeholder = '…' }: EmailDisplayProps) {
  const email = useSyncExternalStore(subscribe, getClientEmail, getServerEmail)

  return <span className={className}>{email || placeholder}</span>
}
