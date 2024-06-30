import Stripe from 'stripe';
import {STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET} from '../config/config';


const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createPaymentIntent(price: number, metadata: Record<string, any>) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: 'usd',
        metadata: metadata,
        receipt_email: metadata.email,
    });
    return paymentIntent.client_secret
}

export function verifyStripeSignature(payload: Buffer, sig: string | undefined): Stripe.Event {
    const endpointSecret = STRIPE_WEBHOOK_SECRET;
    if (!sig || !endpointSecret) {
        throw new Error('Missing Stripe signature or endpoint secret');
    }

    try {
        return stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Webhook Error: ${err.message}`);
        } else {
            throw new Error('Unknown error during webhook verification');
        }
    }
}