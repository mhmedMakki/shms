import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Cairo as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import Nav from '@/components/navigation/Nav'
import { Toaster } from '@/components/ui/sonner'
import SessionProvider from '@/providers/SessionProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import './globals.css'

export const fontSans = FontSans({ subsets: ['arabic'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'شمس | للخدمات الزراعية',
  description: 'شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang='ar'>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased bg-gray-100 dark:bg-gray-900 overflow-x-clip',
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Nav />
            <main className='mt-20'>{children}</main>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
