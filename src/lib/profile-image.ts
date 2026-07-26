import profileLightJpg from '../assets/profile-272.jpg'
import profileLightWebp from '../assets/profile-272.webp'

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
