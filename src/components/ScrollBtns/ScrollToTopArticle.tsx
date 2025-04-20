'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function ScrollToTopArticle() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector('article.blog-post') as HTMLDivElement
      if (!article) return

      const articleHeight = article.offsetHeight
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY

      const articleLongEnough = articleHeight > viewportHeight * 2
      const userScrolledFarEnough = scrollY > viewportHeight * 1.5

      setShow(articleLongEnough && userScrolledFarEnough)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-4 bottom-10 md:right-12 md:bottom-12 z-40 border border-pink-400 bg-black/60 p-2 text-xs font-mono text-pink-400 transition hover:brightness-125 hover:shadow-pink-500/40 hover:shadow-lg"
        >
          ▲ Top
        </motion.button>
      )}
    </AnimatePresence>
  )
}
