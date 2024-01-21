import { randomUUID } from 'crypto'
import { connectDB } from '../../utils/db'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import email, { customEmail } from '../../utils/email'
import { UserProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const { email: userEmail, phone } = body.json()

  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ? OR shms_phone = ?`, [
        userEmail,
        phone
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({
          forgotPassSent: 0,
          message: `Sorry, we couldn't find your account`
        }),
        { status: 404 }
      )
    } else {
      if (user.shms_user_account_status === 'block') {
        return new Response(
          JSON.stringify({
            forgotPassSent: 0,
            message: `Your Account Has Been Blocked, Please Contact The Admin`
          }),
          { status: 403 }
        )
      } else if (
        user.shms_user_reset_token &&
        Number(user.shms_user_reset_token_expires) > Date.now()
      ) {
        return new Response(
          JSON.stringify({
            forgotPassSent: 0,
            message: `Your Already Have A Pending Password Reset Request, Please Check Your Email Inbox`
          }),
          { status: 403 }
        )
      } else if (user.shms_user_account_status === 'active') {
        const userResetPasswordToken = randomUUID()
        const userResetPasswordExpires = Date.now() + 3600000 // 1 hour

        await connectDB(
          `UPDATE users SET shms_user_reset_token = ?, shms_user_reset_token_expires = ? WHERE shms_id = ?`,
          [userResetPasswordToken, userResetPasswordExpires, user.shms_id]
        )

        //send the user an email with a link to reset his/her password
        const buttonLink = APP_URL + `/auth/reset?t=${userResetPasswordToken}`

        const emailData = {
          from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
          to: user.shms_email,
          subject: 'إعادة تعيين كلمة المرور | شمس للخدمات الزراعية',
          msg: customEmail({ buttonLink })
        }

        try {
          const { accepted, rejected } = await email(emailData)

          if (accepted.length > 0) {
            return new Response(
              JSON.stringify({
                message: `An email has been sent to your email address: ${user.shms_email} with the instructions on how to reset the password`,
                forgotPassSent: 1
              })
            )
          } else if (rejected.length > 0) {
            return new Response(
              JSON.stringify({
                forgotPassSent: 0,
                message: `Sorry, we couldn't send the email to your email address: ${
                  rejected[0] /*.message*/
                }`
              })
            )
          }
        } catch (error) {
          return new Response(
            JSON.stringify({
              message: `Ooops!, something went wrong!: ${error} `,
              mailSent: 0
            })
          )
        }
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Ooops!, something went wrong!: ${error}`,
        newPassSet: 1
      })
    )
  }
}
