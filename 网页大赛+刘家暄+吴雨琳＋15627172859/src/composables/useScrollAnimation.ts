/**
 * 滚动入场动画 composable
 * 来自: docs/plans/visual-unification-plan.md §0.2
 *
 * 用法:
 *   const { sectionRefs, setupAnimations } = useScrollAnimation()
 *   setupAnimations()
 *
 *   template 中绑定 ref:
 *   <section ref="(el) => sectionRefs.push(el)" class="fade-in-up">
 */

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

    onMounted(() => {
      elements.forEach(el => {
        if (el) observer!.observe(el)
      })
    })

    onUnmounted(() => {
      if (observer) observer.disconnect()
    })
  }

  return { sectionRefs, setupAnimations }
}
