import { profile } from '../../data/portfolio'
import { profilePhotoLight } from '../../lib/profile-image'
import { cn } from '../../lib/utils'

type ProfilePhotoProps = {
  className?: string
  /** Preload on boot — eager + high fetch priority */
  priority?: boolean
}

export function ProfilePhoto({ className, priority = false }: ProfilePhotoProps) {
  return (
    <picture className={cn('relative block', className)}>
      <source srcSet={profilePhotoLight.webp} type="image/webp" />
      <img
        src={profilePhotoLight.jpg}
        alt={profile.name}
        className="block h-full w-full bg-white object-contain"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}
