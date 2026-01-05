import { useEffect, useRef, useState } from 'react'

interface UseResizeObserverOptions {
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
}

export const useResizeObserver = (options: UseResizeObserverOptions = {}) => {
  const { box = 'border-box' } = options
  const ref = useRef(null)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: observedWidth, height: observedHeight } = entry.contentRect
        setWidth(observedWidth)
        setHeight(observedHeight)
      }
    })

    observer.observe(element, { box })

    return () => {
      observer.disconnect()
    }
  }, [box])

  return { ref, width, height }
}





