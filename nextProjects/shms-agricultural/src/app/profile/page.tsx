'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Info } from 'lucide-react'
import { UserLoggedInProps } from '@/types'


export default function ProfilePage() {

  const [isRendered, setIsRendered] = useState(false);
  const [isRendered2, setIsRendered2] = useState(false);

  const renderComponents2 = () =>{
    return(
      <>

<div dir='rtl' className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='password'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                كلمة المرور الجديدة
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='password'
                //onChange={handlePasswordChange}
                //onBlur={blurPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='password'
                placeholder='******'
              />
            </div>
          </div>

          <div dir='rtl' className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='password'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
               تاكيد كلمة المرور الجديدة
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='password'
                //onChange={handlePasswordChange}
                //onBlur={blurPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='password'
                placeholder='******'
              />
            </div>
          </div>

          <div>
      <Button onClick={handleClickCancelReNewPassword2} style={{margin:10}}>
        الغاء
      </Button>

      <Button style={{margin:10}}>
        استمرار
      </Button>
      </div>

      </>
    )
  }

  const renderComponents = () =>{
    return(
      <>

<div dir='rtl' className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='password'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                كلمة المرور
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='password'
                //onChange={handlePasswordChange}
                //onBlur={blurPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='password'
                placeholder='******'
              />
            </div>
          </div>

          <div>
      <Button onClick={handleClickCancelReNewPassword} style={{margin:10}}>
        الغاء
      </Button>
      <Button onClick={handleClickReNewPassword2} style={{margin:10}}>
        استمرار
      </Button>
      
      </div>
      {isRendered2 && renderComponents2()}
      </>
    )
  }

  const handleClickReNewPassword = () => {
    // Call the fff function and update the state to indicate it has been rendered
    setIsRendered(true);
  };

  const handleClickCancelReNewPassword = () => {
    // Call the fff function and update the state to indicate it has been rendered
    setIsRendered(false);
  };

  const handleClickReNewPassword2 = () => {
    // Call the fff function and update the state to indicate it has been rendered
    setIsRendered2(true);
  };

  const handleClickCancelReNewPassword2 = () => {
    // Call the fff function and update the state to indicate it has been rendered
    setIsRendered2(false);
  };



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

          <Button style={{margin:10}} onClick={handleClickReNewPassword}>
            اعادة تعيين كلمة المرور
          </Button>
          {isRendered && renderComponents()}



        </div>
        
      </CardWrapper>
    </section>
  )
}
