import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createPaymentIntent(price: number, paymentMethodId: string, metadata: Record<string, any>) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: 'usd',
        payment_method: paymentMethodId,
        metadata: metadata,
    });
    return paymentIntent.client_secret;
}


// export async function createPaymentIntent(itemType: string, itemId: number, userId: number): Promise<string> {
//     let info: PhotoType[] | AlbumType[];

//     if (itemType === 'photo') {
//         info = await getPhotosInfo([itemId]);
//     } else if (itemType === 'album') {
//         info = await albumInfo(itemId);
//     } else {
//         throw new Error('Invalid item type');
//     }
//     if (!info[0]) {
//         throw new Error('Price not found');
//     }
//     if (info[0].paid) {
//         throw new Error('Item already paid');
//     }
//     const price = info[0].price;

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [{
//             price_data: {
//                 currency: 'usd',
//                 product_data: {
//                     name: `${itemType} purchase`,
//                 },
//                 unit_amount: price * 100,
//             },
//             quantity: 1,
//         }],
//         mode: 'payment',
//         success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//         metadata: {
//             itemType,
//             itemId,
//             userId,
//         },
//     });

//     return session.id;
// }

export async function handleStripeWebhook(event: Stripe.Event) {
    if ((event.type === 'payment_intent.succeeded') || (event.type === 'payment_intent.payment_failed')) {
        const intent = event.data.object as Stripe.PaymentIntent;

        const itemType = intent.metadata?.itemType;
        const itemId = intent.metadata?.itemId;
        const userId = intent.metadata?.userId;

        if (!itemType || !itemId || !userId) {
            throw new Error('Missing metadata in Stripe session');
        }

         return {
            success: event.type === 'payment_intent.succeeded' ? 1 : 0,
            metadata: intent.metadata,
            event
        };
    }

    return {success: null, event};
}

export function verifyStripeSignature(payload: Buffer, sig: string | undefined): Stripe.Event {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // let printablePayload = payload.toString('utf8');
    // printablePayload = JSON.parse(printablePayload);
    // console.log('payload', printablePayload);
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

// async function test() {
//     const cardToken = await createCardToken('')
//     console.log(cardToken);
// }