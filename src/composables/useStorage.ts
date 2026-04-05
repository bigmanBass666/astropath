import { ref, watch } from 'vue'

const PREFIX = 'astropath_'

function prefixedKey(key: string): string {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function useStorage<T>(key: string, defaultValue: T) {
  const fullKey = prefixedKey(key)
  const data = ref<T>(parseJSON<T>(localStorage.getItem(fullKey), defaultValue))

  const set = (value: T): void => {
    data.value = value
  }

  const remove = (): void => {
    data.value = structuredClone(defaultValue)
    localStorage.removeItem(fullKey)
  }

  watch(data, (newValue) => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(newValue))
    } catch (e) {
      console.warn(`[useStorage] Failed to save "${key}":`, e)
    }
  }, { deep: true })

  return { data, set, remove }
}

export function storageGet<T>(key: string, fallback: T): T {
  return parseJSON<T>(localStorage.getItem(prefixedKey(key)), fallback)
}

export function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(prefixedKey(key), JSON.stringify(value))
  } catch (e) {
    console.warn(`[storage] Failed to save "${key}":`, e)
  }
}

export function storageRemove(key: string): void {
  localStorage.removeItem(prefixedKey(key))
}

export function storageHas(key: string): boolean {
  return localStorage.getItem(prefixedKey(key)) !== null
}

export const StorageKeys = {
  AI_PROVIDERS: 'ai_providers',
  AI_CONFIG: 'ai_config_v2',
  AI_STREAM_STATE: 'ai_stream_state_v2',
  SCHOOL_FAVORITES: 'school_favorites',
  ASSESSMENT_FORM: 'assessment_form',
  ASSESSMENT_REPORT: 'assessment_report',
  SCHOOL_RECOMMENDATIONS: 'school_recommendations',
  CHAT_STATE: 'chat_state',
  CONVERSATIONS: 'conversations',
  ESSAY_CONTENT: 'essay_current_content',
  ESSAY_VERSIONS: 'essay_versions',
  MATERIALS_CHECKLIST: 'materials_checklist',
  APPLICATION_PROGRESS: 'application_progress_data',
  TIMELINE: 'timeline_data',
  ANNOUNCEMENT_READ_IDS: 'announcement_read_ids',
} as const
