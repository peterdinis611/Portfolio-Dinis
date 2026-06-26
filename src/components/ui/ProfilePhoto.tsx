import { profile } from '../../data/portfolio'
import { profilePhotoJpg, profilePhotoWebp } from '../../lib/profile-image'

type ProfilePhotoProps = {
  className?: string
  /** Preload on boot — eager + high fetch priority */
  priority?: boolean
}

export function ProfilePhoto({ className, priority = false }: ProfilePhotoProps) {
  return (
    <picture className={className}>
      <source srcSet={profilePhotoWebp} type="image/webp" />
      <img
        src={profilePhotoJpg}
        alt={profile.name}
        className="block h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}
