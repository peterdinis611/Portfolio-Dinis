import profileLightJpg from '../assets/profile.png?w=272&format=jpeg'
import profileLightWebp from '../assets/profile.png?w=272&format=webp'

/** 272px (2× display) — WebP primary, JPEG fallback */
export const profilePhotoLight = {
  webp: profileLightWebp,
  jpg: profileLightJpg,
} as const

/** @deprecated Use profilePhotoLight */
export const profilePhotoWebp = profileLightWebp
/** @deprecated Use profilePhotoLight */
export const profilePhotoJpg = profileLightJpg

export const profilePhotoSources = [profileLightWebp, profileLightJpg] as const
