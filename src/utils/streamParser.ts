const SEPARATOR = '\n\n---\n\n'
const THINK_TAG_START = '\u003Cthink\u003E'
const THINK_TAG_END = '\u003C/think\u003E'

export function hasReasoningContent(content: string): boolean {
  if (!content) return false
  if (content.includes(THINK_TAG_START)) return true
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return false
  return idx > 0
}

export function hasMainContent(content: string): boolean {
  if (!content) return false
  const thinkEndIdx = content.indexOf(THINK_TAG_END)
  if (thinkEndIdx !== -1 && thinkEndIdx < content.length - THINK_TAG_END.length) return true
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return !content.includes(THINK_TAG_START)
  return idx < content.length - SEPARATOR.length
}

export function getReasoningContent(content: string): string {
  if (!content) return ''
  const thinkStartIdx = content.indexOf(THINK_TAG_START)
  if (thinkStartIdx !== -1) {
    const thinkEndIdx = content.indexOf(THINK_TAG_END, thinkStartIdx)
    if (thinkEndIdx !== -1) {
      return content.slice(thinkStartIdx + THINK_TAG_START.length, thinkEndIdx).trim()
    }
    return content.slice(thinkStartIdx + THINK_TAG_START.length).trim()
  }
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return ''
  return content.slice(0, idx).trim()
}

export function getMainContent(content: string): string {
  if (!content) return ''
  const thinkStartIdx = content.indexOf(THINK_TAG_START)
  if (thinkStartIdx !== -1) {
    const thinkEndIdx = content.indexOf(THINK_TAG_END, thinkStartIdx)
    if (thinkEndIdx !== -1) {
      return content.slice(thinkEndIdx + THINK_TAG_END.length).trim()
    }
    return ''
  }
  const idx = content.indexOf(SEPARATOR)
  if (idx === -1) return content
  return content.slice(idx + SEPARATOR.length).trim()
}
