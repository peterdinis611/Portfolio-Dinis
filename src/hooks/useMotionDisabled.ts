import { useReducedMotion } from 'framer-motion'
import { SettingsContext } from '@/context/AppProviders'

/** True when OS reduced-motion is on OR user disabled animations in settings. */
export function useMotionDisabled() {
  const reduceOs = useReducedMotion()
  const animations = SettingsContext.useSelector((s) => s.context.animations)
  return Boolean(reduceOs) || animations === 'off'
}
