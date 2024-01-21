'use client'

import Link from 'next/link'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

export default function ProfilePage() {
  const HEADING = (
    <p className='flex text-center max-w-lg items-center justify-center rtl'>
      <Info className='w-16 h-16 text-blue-300' />
      مرحبا بك في مشاريع شمس للخدمات الزراعية
    </p>
  )

  return (
    <section>
      <CardWrapper
        heading={HEADING}
        backButtonLabel='الذهاب للصفحة الرئيسية'
        backButtonHref='/'
        className='md:w-[50rem] mt-[15rem] mx-auto'
      >
        <div className='flex items-center justify-center'>
          <Button
            asChild
            className='shadow mt-14 w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
          >
            <Link href='/projects'>الذهاب إلـــى المشاريع</Link>
          </Button>
        </div>
      </CardWrapper>
    </section>
  )
}
