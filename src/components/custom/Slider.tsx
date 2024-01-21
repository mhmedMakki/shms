'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Overlay from './Overlay'

export default function Slider({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
  }, [api])

  return (
    <section className='overflow-hidden relative w-screen'>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 2000 })]}
        className='w-full'
      >
        <CarouselContent overlay={<Overlay className='opacity-20' />}>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <CardContent className='flex items-center justify-center w-screen min-w-[100svh] h-1/4 sm:h-1/2 md:h-[35rem] max-h-max p-0'>
                <Image
                  src={image}
                  // proiority={index === 0 ? true : false}
                  alt={`Slide ${index + 1}`}
                  className='w-full h-full object-cover'
                  width={'1024'}
                  height={'850'}
                />
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute left-10 top-[15%] sm:top-1/4 md:top-1/2 transform -translate-y-1/2 z-50' />
        <CarouselNext className='absolute right-10 top-[15%] sm:top-1/4 md:top-1/2 transform -translate-y-1/2 z-50' />
      </Carousel>
    </section>
  )
}
