/**
 * Scroll an element into the center of its nearest scrollable container.
 *
 * Radix ScrollArea keeps `overflow: hidden` on its root and puts the actual
 * scrollable region on an inner viewport element (`data-radix-scroll-area-viewport`).
 * The native `scrollIntoView` call walks the ancestor chain and hits the hidden
 * root before it reaches the viewport, so it does nothing on constrained layouts
 * (e.g. the fixed-height 2xl column).
 *
 * This helper walks up from the target element with `closest()` to find the
 * Radix viewport first. If the viewport is actually overflowing (constrained
 * layout), we scroll it manually. Otherwise we fall back to `scrollIntoView`
 * so the window itself scrolls (unconstrained / mobile layouts).
 */
export const scrollElementIntoView = (element: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
  const viewport = element.closest<HTMLElement>('[data-radix-scroll-area-viewport]')
  if (viewport && viewport.scrollHeight > viewport.clientHeight) {
    const elementRect = element.getBoundingClientRect()
    const viewportRect = viewport.getBoundingClientRect()
    const targetScrollTop =
      viewport.scrollTop + elementRect.top - viewportRect.top - (viewportRect.height - elementRect.height) / 2
    viewport.scrollTo({ top: targetScrollTop, behavior })
  } else {
    element.scrollIntoView({ behavior, block: 'center' })
  }
}
