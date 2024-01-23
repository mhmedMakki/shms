import { usePathname } from 'next/navigation'

interface HeaderProps {
  heading?: string | React.ReactNode
  label: string
}

export const Header = ({ label, heading }: HeaderProps) => {
  const isSigninPage = usePathname().includes('signin')

  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <h1 className={`text-2xl font-bold`}>
        {heading ?? (isSigninPage ? 'تسجيل الدخول' : 'انشاء حساب')}
      </h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  )
}
