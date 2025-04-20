

import { IconOrnateUpArrow } from '../Icons'

export default function ScrollToTop({type, showBackToTop, scrollToTop}: {type: "blog" | "other", showBackToTop: boolean, scrollToTop: () => void}) {
  return (
                <button type="button" className={`${type == 'blog'? 'ornate-back-to-top' : 'futuristic-back-to-top'} ${showBackToTop ? 'visible' : ''}`} onClick={scrollToTop} aria-label="Back to top" title="Back to top">
                    <div className="button-bg"></div>
                    <IconOrnateUpArrow className="icon" />
                </button>

  ) 
}


/* 

'use client'

import { IconOrnateUpArrow } from '../Icons'; // Assuming you have a simpler arrow icon

export default function ScrollToTop({type, showBackToTop, scrollToTop}: {type: "blog" | "other", showBackToTop: boolean, scrollToTop: () => void}) {
  return (
    <button
      type="button"
      className={`back-to-top ${type === 'other' ? 'futuristic-back-to-top' : 'ornate-back-to-top'} ${showBackToTop ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <div className="button-bg"></div>
      {/* {type === 'other' ? <IconArrowUp className="icon" /> : <IconOrnateUpArrow className="icon" />} }
      <IconOrnateUpArrow/>
    </button>
  );
}

*/