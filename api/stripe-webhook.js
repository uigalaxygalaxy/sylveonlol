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

        const line2 = session.customer_details.address.line2 === null ? " " : session.customer_details.address.line2;


        const currency = (session.currency).toUpperCase();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: session.customer_details.email,
            subject: 'THANKS FOR PURCHASING!!!! ヽ(>∀<☆)ノ',
            text: `THANKS FOR BUYING!!!! 
            You have purchased our goods for ${session.amount_total / 100} ${currency}! 
        
            Your goods will be shipped to: ${session.customer_details.address.line1} ${line2}, ${session.customer_details.address.postal_code} ${session.customer_details.address.state} ${session.customer_details.address.country}
        
            We will give you your shipping number once we get to your order!
            
            Thanks for the support!~ (ﾉ*ФωФ)ﾉ`,
            
            html: `
                        <img src="https://sylveonlol.vercel.app/thanksforpurchasing.png" style="height: 400px">

                <div><span style="color: #6bd1ff">T</span><span style="color: #74cbfd">H</span><span style="color: #7cc4fb">A</span><span style="color: #85bef9">N</span><span style="color: #8eb7f6">K</span><span style="color: #97b1f4">S</span><span style="color: #9fabf2"> </span><span style="color: #a8a4f0">F</span><span style="color: #b19eee">O</span><span style="color: #ba97ec">R</span><span style="color: #c291ea"> </span><span style="color: #cb8be8">B</span><span style="color: #d484e5">U</span><span style="color: #dd7ee3">Y</span><span style="color: #e577e1">I</span><span style="color: #ee71df">N</span><span style="color: #e669d4">G</span><span style="color: #de61c9">!</span><span style="color: #d659bf">!</span><span style="color: #ce51b4">!</span><span style="color: #c649a9">!</span><span style="color: #be419e"> </span><span style="color: #b63994">ヽ</span><span style="color: #ae3089">(</span><span style="color: #a6287e">></span><span style="color: #9e2073">∀</span><span style="color: #961868"><</span><span style="color: #8e105e">☆</span><span style="color: #860853">)</span><span style="color: #7e0048">ノ</span></div>
                <p>You have purchased our goods for <strong>${session.amount_total / 100} ${currency}</strong>!</p>
                
                <h3>Shipping Details:</h3>
                <p>
                    ${session.customer_details.address.line1} ${line2 ? line2 : ''},<br>
                    ${session.customer_details.address.postal_code} ${session.customer_details.address.state},<br>
                    ${session.customer_details.address.country}
                </p>
                
                <p>We will provide your shipping number once we process your order,</p>
                
                <p>Thanks for the support!~ (ﾉ*ФωФ)ﾉ</p>
            `
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