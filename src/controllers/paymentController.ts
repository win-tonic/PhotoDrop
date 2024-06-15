import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createPaymentIntent, verifyStripeSignature } from '../services/stripeService';
import { albumInfo } from '../db/dbInteractions/dbAlbum';
import { getPhotosInfo } from '../db/dbInteractions/dbPhoto';
import { labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import { labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';
import { getClientInfo } from '../db/dbInteractions/dbClient';
import { addPaymentIntentRecord, getPaymentIntentRecord, updatePaymentIntentRecord } from '../db/dbInteractions/dbPayments';

dotenv.config();

class PaymentController {
    constructor() {
        this.createPayment = this.createPayment.bind(this);
        this.webhook = this.webhook.bind(this);
    }

    public async createPayment(req: Request, res: Response) {
        const { itemType, itemId } = req.body;
        const userId = res.locals.tokenInfo.id;
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        let email = res.locals.tokenInfo.email;

        try {
            let info;
            if (!itemId || !itemType) {
                return res.status(400).json({ error: 'Item not specified' });
            }
            if (itemType === 'photo') {
                info = await getPhotosInfo([itemId]);
            } else if (itemType === 'album') {
                info = await albumInfo(itemId);
            }

            if (!info || !info[0]) {
                return res.status(404).json({ error: 'Item not found' });
            }
            else if (info[0].paid) {
                return res.status(400).json({ error: 'Item already paid' });
            }
            if (!email){
                const userInfo = await getClientInfo(phoneNumber);
                if (!userInfo || !userInfo[0]) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                email = userInfo[0].email;
            }

            const price = info[0].price * 100; // Convert to cents
            const metadata = { itemType, itemId, userId, email};
            const clientSecret = await createPaymentIntent(price, metadata) as string;
            await addPaymentIntentRecord(itemType, itemId, userId, clientSecret)
            res.status(200).json({ clientSecret });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async webhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;

        try {
            const event = verifyStripeSignature(req.body, sig);
            if (event.type === 'payment_intent.succeeded'){
                const clientSecret = event.data.object.client_secret as string;
                const intentInfo = await getPaymentIntentRecord(clientSecret);
                if (!intentInfo || !intentInfo[0]) {
                    return res.status(404).json({ error: 'Payment intent not found' });
                }
                if (intentInfo[0].itemType === 'photo') {
                    await labelPhotosAsPaid([intentInfo[0].itemId]);
                }
                if (intentInfo[0].itemType === 'album') {
                    await labelAlbumAsPaid(intentInfo[0].itemId);
                }
                await updatePaymentIntentRecord(clientSecret, 'SUCCEEDED');
            } else if (event.type === 'payment_intent.payment_failed') {
                const clientSecret = event.data.object.client_secret as string;
                await updatePaymentIntentRecord(clientSecret, 'FAILED');
            }
            res.status(200).json({ received: true });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error handling Stripe webhook:', error);
                res.status(400).send(`Webhook Error: ${error.message}`);
            } else {
                console.error('Unknown error handling Stripe webhook:', error);
                res.status(400).send('Webhook Error');
            }
        }
    }

    public async getPaymentIntentStatus(req: Request, res: Response) {
        const clientSecret = req.query.clientSecret as string;
        const userId = res.locals.tokenInfo.id;
        try {
            if (!clientSecret) {
                return res.status(400).json({ error: 'Item not specified' });
            }
            const paymentIntent = await getPaymentIntentRecord(clientSecret)
            if (!paymentIntent || !paymentIntent[0]) {
                return res.status(404).json({ error: 'Payment intent not found' });
            }
            if (paymentIntent[0].userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
            res.status(200).json({ paymentStatus: paymentIntent[0].status });
        } catch (error) {
            console.error('Error getting payment intent:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const paymentController = new PaymentController();
export { paymentController };