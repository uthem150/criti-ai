/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CHALLENGE_CACHE_TTL: string
  readonly VITE_MAX_CHALLENGES_PER_SESSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
