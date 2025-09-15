import nodemailer from 'nodemailer'

// Email configuration
const GMAIL_USER = 'will@thefavrs.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

// Recipients for notifications
const NOTIFICATION_RECIPIENTS = [
  'will@thefavrs.com',
  'joemajorservices@gmail.com',
  'joe@thefavrs.com'
]

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
})

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
}

interface NewsletterData {
  email: string
}

export async function sendContactFormEmail(data: ContactFormData) {
  const { firstName, lastName, email, phone, message } = data

  const mailOptions = {
    from: GMAIL_USER,
    to: NOTIFICATION_RECIPIENTS.join(', '),
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ''}
      <hr>
      <p><small>This email was sent from the TheFavrs website contact form.</small></p>
    `,
    text: `
      New Contact Form Submission

      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      ${message ? `Message: ${message}` : ''}

      This email was sent from the TheFavrs website contact form.
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Contact form email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending contact form email:', error)
    throw error
  }
}

export async function sendNewsletterSignupEmail(data: NewsletterData) {
  const { email } = data

  const mailOptions = {
    from: GMAIL_USER,
    to: NOTIFICATION_RECIPIENTS.join(', '),
    subject: `New Newsletter Signup: ${email}`,
    html: `
      <h2>New Newsletter Signup</h2>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p><small>This notification was sent from the TheFavrs website newsletter signup.</small></p>
    `,
    text: `
      New Newsletter Signup

      Email Address: ${email}
      Date: ${new Date().toLocaleString()}

      This notification was sent from the TheFavrs website newsletter signup.
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Newsletter signup notification sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending newsletter signup notification:', error)
    throw error
  }
}

// Welcome email to the person who signed up
export async function sendNewsletterWelcomeEmail(email: string) {
  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: 'Welcome to TheFavrs Newsletter!',
    html: `
      <h2>Welcome to TheFavrs!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You'll be the first to know about:</p>
      <ul>
        <li>Exclusive events and experiences</li>
        <li>New technology solutions</li>
        <li>Industry insights and tips</li>
        <li>Special offers and promotions</li>
      </ul>
      <p>We're excited to have you as part of our community!</p>
      <hr>
      <p><small>If you didn't sign up for this newsletter, please ignore this email or contact us at will@thefavrs.com</small></p>
    `,
    text: `
      Welcome to TheFavrs!

      Thank you for subscribing to our newsletter.

      You'll be the first to know about:
      - Exclusive events and experiences
      - New technology solutions
      - Industry insights and tips
      - Special offers and promotions

      We're excited to have you as part of our community!

      If you didn't sign up for this newsletter, please ignore this email or contact us at will@thefavrs.com
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}