import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  const sectionRefs = (el: HTMLElement | null | undefined) => {
    if (el) elements.push(el)
  }

  const elements: HTMLElement[] = []
  let observer: IntersectionObserver | null = null

  const setupAnimations = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach(el => {
      if (el) observer!.observe(el)
    })
  }

  onMounted(() => setupAnimations())
  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { sectionRefs, setupAnimations }
}
