import { connectDB } from '../../utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { NextRequest } from 'next/server'
import email, { customEmail } from '../../utils/email'
import type { UserProps } from '@/types'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId } = body

  if (!userId) throw new Error('User ID is required')

  try {
    // Check if user exists
    const userExists = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    // If user does not exist
    if (!userExists) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    // If user exists but already activated
    if (Number(userExists.shms_user_reset_token_expires) >= Date.now()) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'الرمز المرسل غير صالح' }),
        { status: 400 }
      )
    } else if (
      userExists.shms_user_reset_token_expires === null &&
      (userExists.shms_user_account_status === 'active' ||
        userExists.shms_user_account_status === 'block')
    ) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'الحساب مفعل سابقاً' }),
        { status: 400 }
      )
    } else {
      // activate user
      const activateUser = (await connectDB(
        `UPDATE users SET shms_user_account_status = ?, shms_user_reset_token_expires = NULL WHERE shms_id = ?`,
        ['active', userId]
      )) as ResultSetHeader

      const { affectedRows: isActivated } = activateUser as ResultSetHeader

      if (isActivated) {
        //send the user an email with a link to activate his/her account
        const buttonLink = APP_URL + `/auth/signin`

        const emailData = {
          from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
          to: userExists?.shms_email,
          subject: 'تم تفعيل حسابك بنجاح | شمس للخدمات الزراعية',
          msg: customEmail({
            title: 'مرحباً بك في شمس للخدمات الزراعية',
            msg: `
            <h1 style="font-weight:bold">مرحباً ${userExists?.shms_fullname},</h1>
            <p>
             شكراً لتسجيلك في شمس للخدمات الزراعي،
             تم تفعيل حسابك بنجاح، يمكنك الآن تسجيل الدخول إلى حسابك من خلال الرابط أدناه:
            </p>
            <br /><br />
            <small>إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك مشكلة ما، يرجى تجاهل هذا البريد من فضلك!</small>`,
            buttonLink,
            buttonLabel: 'تسجيل الدخول'
          })
        }

        const { accepted, rejected } = await email(emailData)
        if (accepted.length > 0) {
          return new Response(
            JSON.stringify({
              userActivated: 1,
              message: 'User Successfully Registered You Can Login 👍🏼'
            }),
            { status: 201 }
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              userActivated: 0,
              message: 'User Not Added!, Please Try Again Later'
            }),
            { status: 500 }
          )
        }
      }
    }
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userActivated: 0,
        message: 'User was not activated, Please Try Again Later'
      }),
      { status: 500 }
    )
  }
}
