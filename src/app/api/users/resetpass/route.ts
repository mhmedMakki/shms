import { connectDB } from '../../utils/db'
import { genSalt, hash } from 'bcryptjs'
import email, { customEmail } from '../../utils/email'
import type { UserProps } from '@/types'
import { ADMIN_EMAIL } from '@/data/constants'

export async function POST(req: Request) {
  const body = await req.json()
  const { userPassword, token } = body.json()

  try {
    // Check for user
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_user_reset_password_token = ?`, [
        token
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ newPassSet: 0, message: `Sorry, we couldn't find your account` })
      )
    } else if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `Your Account Has Been Blocked, Please Contact The Admin`
        })
      )
    } else if (Number(user.shms_user_reset_token_expires) < Date.now()) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `Sorry, Your Password Reset Link Has Expired, Please Request A New One`
        })
      )
    } else if (JSON.parse(token) === user.shms_user_reset_token) {
      // Hash new password
      const salt = await genSalt(10)
      const hashedPassword = await hash(userPassword, salt)

      await connectDB(
        `UPDATE users SET shms_password = ?, shms_user_reset_token = ?, shms_user_reset_token_expires = ? WHERE shms_id = ?`,
        [hashedPassword, null, null, user.shms_id]
      )

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: ADMIN_EMAIL ?? 'mr.hamood277@gmail.com',
        to: user.shms_email,
        subject: 'Your Password Has been Reset',
        msg: customEmail({
          title: 'Your password has been rest successfully',
          msg: `If you did not reset your password,
            please contact us as soon as possible, otherwise this email is just for notifying you for the change that happened
            <br />
            <small>No need to reply to this email.</small>`
        })
      }

      try {
        const { accepted, rejected } = await email(emailData)

        if (accepted.length > 0) {
          return new Response(
            JSON.stringify({
              message: `An email has been sent to your email address: ${user.shms_email} with the new password`,
              newPassSet: 1
            })
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
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

      return new Response(
        JSON.stringify({
          message: `Your Password Has Been Reset Successfully, Redirecting You To Login Page...`,
          newPassSet: 1
        })
      )
    } else {
      //The password reset link you used is invalid, please request a new one`
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `The password reset link you used is invalid, please request a new one`
        }),
        { status: 400 }
      )
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
