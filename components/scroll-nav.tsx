'use client'

import { useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLenis } from '@/components/providers/lenis-provider'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { id: 'section-1', label: 'Section 1' },
  { id: 'section-2', label: 'Section 2' },
  { id: 'section-3', label: 'Section 3' },
]

export function ScrollNav() {
  const lenis = useLenis()
  const pathname = usePathname()
  const [activeId, setActiveId] = useState('')

  const activate = (id: string) => {
    setActiveId(id)
    history.replaceState(null, '', `${pathname}#${id}`)
  }

  // ✅ lenis が生成された「後」に実行される
  useGSAP(
    () => {
      if (!lenis) return

      NAV_ITEMS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => activate(id),
          onEnterBack: () => activate(id),
        })
      })
    },
    { dependencies: [lenis] },
  )

  useEffect(() => {
    if (!lenis) return

    const syncFromHash = () => {
      const hash = location.hash.replace('#', '')
      if (hash) {
        setActiveId(hash)
        lenis.scrollTo(`#${hash}`, { immediate: true })
      }
    }

    syncFromHash()
    window.addEventListener('popstate', syncFromHash)

    return () => {
      window.removeEventListener('popstate', syncFromHash)
    }
  }, [lenis])

  const handleClick = (id: string) => {
    if (!lenis) return
    activate(id)
    lenis.scrollTo(`#${id}`)
  }

  return (
    <nav className="fixed top-4 left-4 z-50 space-y-2">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`block rounded px-3 py-1 transition ${
            activeId === item.id
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
