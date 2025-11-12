import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import Image from 'next/image'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaArrowButtons'
import { DotButton, useDotButton } from './EmblaDotButtons'

interface Project {
    id: number;
    imageUrl: string;
    link: string;
    title: string;
  }
  

type PropType = {
  slides: Project[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
        {slides.map(({ id, imageUrl, link, title }, index) => (
  <div
    className="embla__slide relative flex flex-col items-center justify-center"
    key={id}
  >
    <a href={link} target="_blank" rel="noopener noreferrer" className="group">
      <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105">
        <Image
          className="embla__slide__img w-full h-60 object-cover"
          src={imageUrl}
          alt={title}
          width={600}
          height={330}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 90vw, 600px"
        />
      </div>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 justify-center">
        <h3 className="text-lg font-semibold text-white text-center">{title}</h3>
      </div>
    </a>
  </div>
))}

        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots text-black">
        {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className="embla__dot w-10 h-10 flex items-center justify-center"
                >
                  <span 
                    className={`
                      rounded-full 
                      transition-all 
                      duration-300 
                      relative 
                      flex 
                      items-center 
                      justify-center 
                      
                      
                      ${index === selectedIndex ? 'w-5 h-5' : 'w-3 h-3'}
                    `}
                    style={{
                        background: index === selectedIndex ? 'conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3, #FF0000)': "#000",
                        animation: 'spin 4s linear infinite'
                    }}
                  >
                    {index === selectedIndex && (
                      <span 
                        className="inset-0 rounded-full z-10 w-[60%] h-[60%] bg-[#000] m-auto border-2 border-white" 
                        style={{
                          zIndex: -1,
                          transform: 'scale(1.25)',

                        }}
                      />
                    )}
                  </span>
                </DotButton>
              ))}
            
        </div>
         {/* Add the necessary keyframes animation for the spinning effect */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: scale(1.25) rotate(0deg);
          }
          to {
            transform: scale(1.25) rotate(360deg);
          }
        }
      `}</style>
      </div>
    </div>
  )
}

export default EmblaCarousel
