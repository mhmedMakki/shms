'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import { Button } from '@/components/ui/button'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { validateEmail } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Error } from '@/components/icons/Status'
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import type { UserProps } from '@/types'

const ForgotPasswordPage = () => {
  const HEADING = 'إستعادة كلمة المرور'

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const { replace } = useRouter()

  function resetFormErrors() {
    setEmailError('')
  }

  const handelResetForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    if (email === '') {
      setEmailError('البريد الالكتروني مطلوب')
      return
    } else if (!validateEmail(email)) {
      resetFormErrors()
      setEmailError('الرجاء التأكد من صحة البريد الالكتروني')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const resetPass = await axios.post(`${API_URL}/users/forgotpass`, { email })
        //getting response from backend
        const { data } = resetPass

        // make sure to view the response from the data
        data.forgotPassSent === 1
          ? toast(
              'تم إرسال بريد الكتروني لإعادة تعيين كلمة المرور، الرجاء إتباع التعليمات في البريد لتفعيل حسابك 👍🏼',
              {
                icon: <Info className='text-blue-300' />,
                position: 'bottom-center',
                className: 'text-right select-none rtl',
                duration: DEFAULT_DURATION,
                style: {
                  backgroundColor: '#F0FAF0',
                  color: '#367E18',
                  border: '1px solid #367E18',
                  gap: '1.5rem',
                  textAlign: 'justify'
                }
              }
            )
          : toast('حدث خطأ ما، الرجاء المحاولة مرة أخرى', {
              icon: <Error className='w-6 h-6 ml-3' />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              style: {
                backgroundColor: '#FFF0F0',
                color: '#BE2A2A',
                border: '1px solid #BE2A2A',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })

        setTimeout(() => replace(`/`), DEFAULT_DURATION - 1000)
      } catch (error: any) {
        const message: UserProps['message'] = error?.response.data.message ?? 'حدث خطأ ما'
        //handle error, show notification using Shadcn notifcation
        toast(message, {
          icon: <Error className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          style: {
            backgroundColor: '#FFF0F0',
            color: '#BE2A2A',
            border: '1px solid #BE2A2A',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
        console.error('Error', error)
      } finally {
        setIsSubmittingForm(false)
      }
    }
  }

  return (
    <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
      <CardWrapper
        heading={HEADING}
        backButtonLabel='تذكرت كلمة المرور؟ سجل دخولك'
        backButtonHref='/auth/signin'
        className='md:w-[50rem]'
      >
        <form
          className='w-full min-w-max container'
          dir='rtl'
          onSubmit={e => handelResetForm(e)}
        >
          {emailError && <FormMessage error>{emailError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='email'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                البريد الالكتروني
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='email'
                onChange={e => setEmail(e.target.value)}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='email'
                placeholder='example@gmail.com'
              />
            </div>
          </div>

          <div className='md:flex md:items-center'>
            <div className='md:w-1/3'></div>
            <div className='md:w-2/3'>
              <Button
                type='submit'
                disabled={isSubmittingForm}
                className='shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
              >
                {isSubmittingForm ? (
                  <>
                    <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                    جاري الإرسال
                  </>
                ) : (
                  'استعادة كلمة المرور'
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardWrapper>
    </section>
  )
}

export default ForgotPasswordPage
