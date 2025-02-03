import Stripe from 'stripe';
import { buffer } from 'micro';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const discount = process.env.DISCOUNT;

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Read the raw body
    const rawBody = await buffer(req);
    console.log('Raw body:', rawBody.toString()); // Log raw body for debugging

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Send email receipt
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const currency = (session.currency).toUpperCase();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: session.receipt_email,
            subject: 'THANKS FOR PURCHASING!!!! ヽ(>∀<☆)ノ',
            text: `THANKS FOR BUYING!!!! 

            You have purchased our goods for ${session.amount_total / 100} ${currency}! 

            Your goods will be shipped to: ${session.shipping.address}!


            We will give you your shipping number once we get to your order!
            
            Thanks for the support!~ (ﾉ*ФωФ)ﾉ`,
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
