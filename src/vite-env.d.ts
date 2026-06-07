/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png?w=272&format=webp' {
  const src: string
  export default src
}

declare module '*.png?w=272&format=jpeg' {
  const src: string
  export default src
}

declare module '*.jpg?w=272&format=webp' {
  const src: string
  export default src
}

declare module '*.jpg?w=272&format=jpeg' {
  const src: string
  export default src
}

declare module '*.jpeg?w=272&format=webp' {
  const src: string
  export default src
}

declare module '*.jpeg?w=272&format=jpeg' {
  const src: string
  export default src
}
