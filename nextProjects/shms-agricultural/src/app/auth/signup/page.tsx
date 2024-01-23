'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import {
  validateEmail,
  validatePasswordStrength,
  validateQatarPhoneNumber
} from '@/lib/utils'
import type { UserProps } from '@/types'

import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Error } from '@/components/icons/Status'
import FormMessage from '@/components/custom/FormMessage'
import SelectCountry from '@/components/custom/SelectCountry'

const SignupPage = () => {
  // Form States
  const [fName, setFName] = useState('')
  const [sName, setSName] = useState('')
  const [tName, setTName] = useState('')
  const [foName, setFoName] = useState('')
  // combine all names to one state
  const [userFullName, setUserFullName] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerm, setAcceptedTerm] = useState(false)
  const [phone, setPhone] = useState('')
  const [file, setFile] = useState<File[]>([])
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const { replace } = useRouter()

  const onFileAdd = (e: { target: { files: any } }) => {
    setFile(e.target.files)
  }

  // Errors States
  const [fullNameError, setFullNameError] = useState('')
  const [nationlityError, setNationlityError] = useState('')
  const [dateOfBirthError, setDateOfBirthError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passError, setPassError] = useState('')
  const [passConfirmError, setPassConfirmError] = useState('')
  const [fileError, setFileError] = useState('')
  const [acceptedTermError, setAcceptedTermError] = useState('')

  const blurEmail = (e: string) => {
    if (!validateEmail(e)) {
      setEmailError('الرجاء التأكد من صحة البريد الالكتروني')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const blurPassword = () => {
    if (!validatePasswordStrength(password)) {
      setPassError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else {
      setPassError('')
    }
  }

  const blurConfrimPassword = () => {
    if (!validatePasswordStrength(password)) {
      setPassConfirmError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else if (password !== confirmPassword) {
      setPassConfirmError('الرجاء التأكد من تطابق كلمة المرور')
    } else {
      setPassConfirmError('')
      resetFormErrors()
    }
  }

  const blurPhone = (p: string) => {
    if (!validateQatarPhoneNumber(p)) {
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف بشكل صحيح')
    } else {
      setPhoneError('')
      resetFormErrors()
    }
  }

  const validateFile = (fileName: string) => {
    // Get the file extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    // Check if the extension is allowed
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf']
    return allowedExtensions.includes(fileExtension!)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.value
    if (!validateFile(fileName)) {
      setFileError('فقط الملفات من النوع jpg, jpeg, png, pdf مسموح بها')
    } else {
      setFileError('')
      onFileAdd(e)
    }
  }

  useEffect(() => {
    setUserFullName(`${fName} ${sName} ${tName} ${foName}`)
  }, [fName, sName, tName, foName])

  const handelSignupForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (fName === '' || sName === '' || tName === '' || foName === '') {
      resetFormErrors()
      setFullNameError('الرجاء التأكد من إدخال الاسم بشكل صحيح')
    } else if (nationality === '') {
      resetFormErrors()
      setNationlityError('الرجاء التأكد من إدخال الجنسية')
    } else if (dateOfBirth === '') {
      resetFormErrors()
      setDateOfBirthError('الرجاء التأكد من إدخال تاريخ الميلاد')
    } else if (!validateEmail(email)) {
      resetFormErrors()
      setEmailError('الرجاء التأكد من صحة البريد الالكتروني')
    } else if (password === '') {
      resetFormErrors()
      setPassError('الرجاء التأكد من إدخال كلمة المرور')
    } else if (!validateQatarPhoneNumber(phone)) {
      resetFormErrors()
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف بشكل صحيح')
    } else if (phone === '') {
      resetFormErrors()
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف')
    } else if (!acceptedTerm) {
      resetFormErrors()
      setAcceptedTermError('الرجاء الموافقة على بنود الاستخدام وسياسة الخصوصية')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)
        const formData = new FormData()
        formData.append('fullname', userFullName)
        formData.append('file', file[0]!)
        const { data: user_doc } = await axios.post(`${API_URL}/uploadurl`, formData)

        const joinUser: { data: UserProps } = await axios.post(
          `${API_URL}/users/signup`,
          {
            userFullName,
            nationality,
            dateOfBirth,
            email,
            phone,
            password,
            user_doc
          }
        )
        //getting response from backend
        const { data } = joinUser

        // make sure to view the response from the data
        data.userAdded === 1 &&
          toast(
            'تم إرسال بريد الكتروني لتأكيد التسجيل ، الرجاء إتباع التعليمات في البريد لتفعيل حسابك 👍🏼',
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

        setTimeout(() => replace(`/`), DEFAULT_DURATION)
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

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setFullNameError('')
    setNationlityError('')
    setDateOfBirthError('')
    setEmailError('')
    setPassError('')
    setPhoneError('')
    setPhoneError('')
    setAcceptedTermError('')
  }

  return (
    <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
      <CardWrapper
        headerLabel='إنضم إلينا'
        backButtonLabel='هل لديك حساب بالفعل؟'
        backButtonHref='/auth/signin'
      >
        <form
          className='w-full max-w-fit md:m-5'
          dir='rtl'
          onSubmit={e => handelSignupForm(e)}
        >
          {fullNameError && <FormMessage error>{fullNameError}</FormMessage>}
          <div className='mb-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 text-xs'
                >
                  الاسم الاول
                </label>
                <input
                  id='firstName'
                  type='text'
                  onChange={e => setFName(e.target.value)}
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  placeholder='محمد'
                />
              </div>
              <div>
                <label
                  htmlFor='secondName'
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 text-xs'
                >
                  الاسم الثاني
                </label>
                <input
                  id='secondName'
                  onChange={e => setSName(e.target.value)}
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='عبدالرحيم'
                />
              </div>
              <div>
                <label
                  htmlFor='thirdName'
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 text-xs'
                >
                  الاسم الثالث
                </label>
                <input
                  id='thirdName'
                  onChange={e => setTName(e.target.value)}
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='محمد'
                />
              </div>
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 text-xs'
                >
                  الاسم الاخير
                </label>
                <input
                  id='lastName'
                  onChange={e => setFoName(e.target.value)}
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='مكي'
                />
              </div>
            </div>
            <div className='md:w-1/3'></div>
          </div>

          {nationlityError && <FormMessage error>{nationlityError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='nationality'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                الجنسية
              </label>
            </div>
            <div className='md:w-2/3'>
              <SelectCountry
                nationality={nationality}
                setNationality={setNationality}
                placeholder='إختر الجنسية ...'
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              />
            </div>
          </div>

          {dateOfBirthError && <FormMessage error>{dateOfBirthError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='dateOfBirth'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                تاريخ الميلاد
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='dateOfBirth'
                onChange={e => setDateOfBirth(e.target.value)}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-right'
                type='date'
                min='1990-01-01'
                max={
                  // todays date - 18 years
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split('T')[0]
                }
              />
            </div>
          </div>

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
                onBlur={e => blurEmail(e.target.value)}
                onChange={e => setEmail(e.target.value)}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='email'
                placeholder='example@gmail.com'
              />
            </div>
          </div>

          {phoneError && <FormMessage error>{phoneError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='phone'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                رقم الهاتف
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='phone'
                onBlur={e => blurPhone(e.target.value)}
                onChange={e => setPhone(e.target.value)}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                dir='rtl'
                type='tel'
                placeholder='55123456'
              />
            </div>
          </div>

          {passError && <FormMessage error>{passError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
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
                onChange={handlePasswordChange}
                onBlur={blurPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='password'
                placeholder='******'
              />
            </div>
          </div>

          {passConfirmError && <FormMessage error>{passConfirmError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='confirmPassword'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                التأكد من كلمة المرور
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                id='confirmPassword'
                onChange={handleConfirmPasswordChange}
                onBlur={blurConfrimPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='password'
                placeholder='******'
              />
            </div>
          </div>

          {fileError && <FormMessage error>{fileError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                htmlFor='document'
                className='block cursor-pointer text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                صورة المستند الرسمي
              </label>
            </div>
            <div className='md:w-2/3'>
              <Input
                id='document'
                type='file'
                aria-label='file'
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 cursor-pointer'
                onChange={handleFileChange}
              />
            </div>
          </div>

          {acceptedTermError && <FormMessage error>{acceptedTermError}</FormMessage>}
          <div className='md:flex flex-col gap-2 w-full mb-6 items-start'>
            <label
              htmlFor='accept_termsAndPrivacy'
              className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 cursor-pointer'
            >
              <Checkbox
                id='accept_termsAndPrivacy'
                className='ml-2'
                onCheckedChange={(isChecked: boolean) => setAcceptedTerm(isChecked)}
              />
              أوافق على &nbsp;
              <Link href='/terms' className='font-bold underline-hover'>
                بنود الاستخدام
              </Link>
              &nbsp; و &nbsp;
              <Link href='/privacy' className='font-bold underline-hover'>
                سياسة الخصوصية
              </Link>
            </label>
            <div className='md:w-1/3'></div>
          </div>

          {/* Submit Button */}
          <div className='md:flex md:items-center'>
            <Button
              disabled={isSubmittingForm}
              type='submit'
              className='shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
            >
              {isSubmittingForm ? (
                <>
                  <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                  جاري التسجيل ...
                </>
              ) : (
                'تسجيل'
              )}
            </Button>
          </div>

          <div className='w-full flex justify-between my-4'>
            <Link
              href='/auth/signin'
              className='text-gray-500 transition-colors hover:text-gray-700 text-sm'
            >
              لديك حساب؟ سجل دخولك
            </Link>
          </div>
        </form>
      </CardWrapper>
    </section>
  )
}

export default SignupPage
