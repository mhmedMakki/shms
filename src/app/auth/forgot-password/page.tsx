import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'

const ForgotPasswordPage = () => {
  const HEADING = 'نسيت كلمة المرور'

  return (
    <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
      <CardWrapper
        heading={HEADING}
        headerLabel={HEADING}
        backButtonLabel='تذكرت كلمة المرور؟ سجل دخولك'
        backButtonHref='/auth/signin'
        className='md:w-[50rem]'
      >
        <form
          className='w-full min-w-max container'
          dir='rtl'
          // onSubmit={e => handelSubmit(e)}
        >
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pl-4'>
                البريد الالكتروني او رقم الهاتف
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 dark:bg-gray-800 appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                id='inline-email'
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
                className='shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
              >
                دخول
              </Button>
            </div>
          </div>
        </form>
      </CardWrapper>
    </section>
  )
}

export default ForgotPasswordPage
