const SEPARATOR = '\n\n---\n\n'

export function hasReasoningContent(content: string): boolean {
  if (!content) return false
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return false
  return idx > 0
}

export function hasMainContent(content: string): boolean {
  if (!content) return false
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return true
  return idx < content.length - SEPARATOR.length
}

export function getReasoningContent(content: string): string {
  if (!content) return ''
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return ''
  return content.slice(0, idx).trim()
}

export function getMainContent(content: string): string {
  if (!content) return ''
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return content
  return content.slice(idx + SEPARATOR.length).trim()
}
