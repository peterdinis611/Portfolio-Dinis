import profileWebp from '../assets/profile.png?w=272&format=webp'
import profileJpg from '../assets/profile.png?w=272&format=jpeg'

/** 272px (2× display) — WebP primary, JPEG fallback */
export const profilePhotoWebp = profileWebp
export const profilePhotoJpg = profileJpg

export const profilePhotoSources = [profileWebp, profileJpg] as const
