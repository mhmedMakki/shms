'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { API_URL } from '@/data/constants'
import { Error, Success } from '@/components/icons/Status'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { cn, validateUUID } from '@/lib/utils'
import { Info } from 'lucide-react'
import type { UserProps } from '@/types'

export default function ActivateAccount({
  params: { userId }
}: {
  params: { userId: string }
}) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isAccountActivated, setIsAccountActivated] = useState(false)

  const handleActivateAccount = async (e: { preventDefault: () => void }) => {
    // don't refresh the page
    e.preventDefault()

    try {
      setIsSubmittingForm(true)
      const activateUser: { data: UserProps } = await axios.post(
        API_URL + `/users/activate`,
        { userId }
      )
      const { userActivated } = activateUser.data

      setIsAccountActivated(userActivated ? true : false)

      userActivated === 1 &&
        toast('مبروك تم تفعيل حسابك في شمس للخدمات الزراعية بنجاح 🎉', {
          icon: <Success className='inline-block' />,
          position: 'bottom-center',
          className: 'text-center rtl select-none',
          style: {
            backgroundColor: '#F0FAF0',
            color: '#367E18',
            border: '1px solid #367E18',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
    } catch (error) {
      console.error(error)
      toast('حدث خطأ ما، يرجى المحاولة مرة أخرى', {
        icon: <Error />,
        position: 'bottom-center',
        className: 'text-center rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const HEADING = (
    <p className='flex flex-wrap text-center max-w-lg items-center justify-center gap-x-3 leading-loose select-none rtl'>
      {isAccountActivated ? (
        <>
          <Success className='w-16 h-16' />
          تم تفعيل حسابك بنجاح يمكنك الآن تسجيل الدخول للمتابعة في تصفح الموقع 👍🏼
        </>
      ) : (
        <>
          <Info className='text-blue-400' />
          تفعيل حسابك في شمس للخدمات الزراعية
        </>
      )}
    </p>
  )

  return !validateUUID(userId) ? null : (
    <section>
      <CardWrapper
        heading={HEADING}
        headerLabel='لتفعيل الحساب الرجاء الضغط على الزر أدناه'
        backButtonLabel='لست مشترك؟ سجل الان'
        backButtonHref='/auth/signup'
        className='md:w-[50rem]'
      >
        <div className='flex items-center justify-center'>
          <form onSubmit={handleActivateAccount}>
            {!isAccountActivated ? (
              <Button
                type='submit'
                disabled={isAccountActivated}
                className={cn(
                  `rtl shadow mt-14 w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold`,
                  (isAccountActivated || isSubmittingForm) &&
                    'cursor-not-allowed opacity-30 pointer-events-none'
                )}
              >
                {isSubmittingForm ? (
                  <>
                    <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                    جاري تفعيل الحساب ...
                  </>
                ) : (
                  'تفعيل الحساب'
                )}
              </Button>
            ) : (
              <Button
                asChild
                className='shadow mt-14 w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
              >
                <Link href='/auth/signin'>تسجيل الدخــــول</Link>
              </Button>
            )}
          </form>
        </div>
      </CardWrapper>
    </section>
  )
}
