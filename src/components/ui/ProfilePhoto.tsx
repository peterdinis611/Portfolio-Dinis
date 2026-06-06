import { Image } from '@chakra-ui/react'
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
      <Image
        src={profilePhotoJpg}
        alt={profile.name}
        width={272}
        height={272}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        fit="cover"
        align="center 12%"
        className="book-page-photo-img"
      />
    </picture>
  )
}
