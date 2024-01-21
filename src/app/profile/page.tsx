'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Info } from 'lucide-react'
import { UserLoggedInProps } from '@/types'

export default function ProfilePage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()

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
        <div className='flex flex-col items-center justify-center'>
          <div>
            <span className='text-center inline-block w-full mb-10'>
              {session?.token?.user.fullname ?? ''}
            </span>
            <p className='text-center max-w-lg items-center justify-center rtl'>
              لا يوجد لديك مشاريع حالياً
            </p>
            <p className='text-center max-w-lg items-center justify-center rtl'>
              يمكنك الاستثمار في مشروع جديد من خلال الضغط على الزر أدناه
            </p>
          </div>

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
