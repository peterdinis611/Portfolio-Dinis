import profileLightJpg from '../assets/profile-272.jpg'
import profileLightWebp from '../assets/profile-272.webp'

function assetSrc(asset: string | { src: string }): string {
  return typeof asset === 'string' ? asset : asset.src
}

/** 272px (2× display) — WebP primary, JPEG fallback */
export const profilePhotoLight = {
  webp: assetSrc(profileLightWebp),
  jpg: assetSrc(profileLightJpg),
} as const

/** @deprecated Use profilePhotoLight */
export const profilePhotoWebp = profilePhotoLight.webp
/** @deprecated Use profilePhotoLight */
export const profilePhotoJpg = profilePhotoLight.jpg

export const profilePhotoSources = [profilePhotoLight.webp, profilePhotoLight.jpg] as const
