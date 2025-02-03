import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const customerEmail = session.customer_email;
        const amountTotal = session.amount_total / 100; // Convert to dollars
        const currency = session.currency;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Your Purchase Receipt',
            text: `Thank you for your purchase! Amount: ${amountTotal} ${currency}.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    res.json({ received: true });
}

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing to handle raw body for Stripe
    },
};
