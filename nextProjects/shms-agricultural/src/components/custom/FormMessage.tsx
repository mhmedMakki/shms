import { cn } from '@/lib/utils'

export default function FormMessage({
  error,
  success,
  className = '',
  children
}: {
  /**
   * رسالة الخطأ باللون الأحمر
   */
  error?: boolean
  /**
   * رسالة الخطأ باللون الأخضر
   */
  success?: boolean
  /**
   * الكلاسات الإضافية
   */
  className?: string
  /**
   * محتوى الرسالة
   */
  children: string
}) {
  return (
    <p
      className={cn(
        `text-center my-2 animate-pulse text-sm ${
          error ? `text-red-600` : success ? `text-green-600` : ''
        }`,
        className
      )}
    >
      {children}
    </p>
  )
}
