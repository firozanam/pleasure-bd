import nodemailer from 'nodemailer'
import { formatCurrency } from '@/lib/utils'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderConfirmationEmail(order) {
  const message = {
    from: process.env.SMTP_FROM,
    to: order.user.email,
    subject: `Order Confirmation - Order #${order._id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order #${order._id} has been received and is being processed.</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.items.map(item => `<li>${item.product.name} - ${formatCurrency(item.price)} x ${item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total: ${formatCurrency(order.total)}</strong></p>
      <p>We'll notify you when your order has been shipped.</p>
    `,
  }

  await transporter.sendMail(message)
}
