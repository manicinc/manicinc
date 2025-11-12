'use client';
import { EmblaOptionsType } from 'embla-carousel';
import dynamic from 'next/dynamic';
import InView from '@/components/InView';
import curve from "@/images/curve.png"
import Image from "next/image"

const EmblaCarousel = dynamic(() => import('./EmblaCarousel'), {
  ssr: false,
  loading: () => null,
});

interface Project {
  id: number;
  imageUrl: string;
  link: string;
  title: string;
}

const projects: Project[] = [
  {
    id: 1,
    imageUrl: "/manic.gif",
    link: 'https://manicinc.github.io/logomaker/',
    title: "Logo Maker"
  },
  {
    id: 2,
    imageUrl: '/velvet_web.png',
    link: 'https://www.manic.agency/velvet',
    title: 'Velvet Web',
  },
  {
    id: 3,
    imageUrl: "/portapack.jpg",
    link: "https://github.com/manicinc/portapack",
    title: "Portapack",
  }
];


const Work = () => {
  
  
  return (
    <section id="work" className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center grow-0 flex flex-col items-center mb-10">
          <span>Our Work</span>
        <Image src={curve} alt="curve" className='w-44 grow-0' loading="lazy" decoding="async"/>
          </h2>
        <p className="text-lg text-center text-gray-700 mb-8">
          Manic Agency houses a number of tech and media oriented platforms striking an impact on the world.
        </p>


        <InView rootMargin="200px">
          <EmblaCarousel slides={projects}/>
        </InView>
        </div>
    </section>
  );
};

export default Work;