import { useEnvironmentContext } from '@chakra-ui/react'
import { useEffect } from 'react'

export function useScrollSpy(options: any) {
  const { data, rootMargin = '-20% 0% -35% 0%', setActiveId } = options

  const env = useEnvironmentContext()

  useEffect(() => {
    const win = env.getWindow()
    const doc = env.getDocument()

    const observer = new win.IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting,
        )
        setActiveId(intersectingEntries.map((entry) => entry.target.id))
      },
      { rootMargin },
    )

    for (const { id } of data) {
      const element = doc.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => observer.disconnect()
  }, [data, rootMargin, setActiveId, env])
}
