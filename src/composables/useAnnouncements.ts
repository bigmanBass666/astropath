import { ref, computed } from 'vue'
import { announcements } from '@/data/announcements'

const READ_IDS_KEY = 'announcement_read_ids'

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]))
}

const readIds = ref<Set<string>>(getReadIds())

export function useAnnouncements() {
  const allAnnouncements = computed(() => [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }))

  const unreadCount = computed(() =>
    allAnnouncements.value.filter((a) => !readIds.value.has(a.id)).length,
  )

  const isUnread = (id: string): boolean => !readIds.value.has(id)

  const markAsRead = (id: string) => {
    readIds.value.add(id)
    saveReadIds(readIds.value)
  }

  const markAllAsRead = () => {
    allAnnouncements.value.forEach((a) => readIds.value.add(a.id))
    saveReadIds(readIds.value)
  }

  return {
    allAnnouncements,
    unreadCount,
    isUnread,
    markAsRead,
    markAllAsRead,
  }
}
