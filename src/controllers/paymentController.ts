import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createPaymentIntent, handleStripeWebhook, verifyStripeSignature } from '../services/stripeService';
import { albumInfo } from '../db/dbInteractions/dbAlbum';
import { getPhotosInfo } from '../db/dbInteractions/dbPhoto';
import { labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import { labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';
import { addPaymentIntentRecord, getPaymentIntentRecord, getPaymentIntentRecordByClientSecret, updatePaymentIntentRecord } from '../db/dbInteractions/dbPayments';

dotenv.config();

class PaymentController {
    constructor() {
        this.createPaymentIntent = this.createPaymentIntent.bind(this);
        this.webhook = this.webhook.bind(this);
    }

    public async createPaymentIntent(req: Request, res: Response) {
        const { itemType, itemId, paymentMethod } = req.body;
        const userId = res.locals.tokenInfo.id;

        try {
            if (!paymentMethod) {
                return res.status(400).json({ error: `Payment token not specified!` });
            }
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

            const price = info[0].price * 100; // Convert to cents
            const metadata = { itemType, itemId, userId };
            const clientSecret = await createPaymentIntent(price, paymentMethod, metadata);
            await addPaymentIntentRecord(itemType, itemId, userId, clientSecret || '')

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
            const result = await handleStripeWebhook(event);
            if (result.success && result.metadata) {
                if (result.metadata.itemType === 'photo') {
                    await labelPhotosAsPaid([parseInt(result.metadata.itemId, 10)]);
                } else if (result.metadata.itemType === 'album') {
                    await labelAlbumAsPaid(parseInt(result.metadata.itemId, 10));
                }
                await updatePaymentIntentRecord(result.metadata.itemType, parseInt(result.metadata.itemId, 10), 'SUCCEEDED');
            } else if (result.success === 0 && result.metadata) {
                await updatePaymentIntentRecord(result.metadata.itemType, parseInt(result.metadata.itemId, 10), 'FAILED');
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
        const itemType = req.query.itemType as string;
        const itemId = parseInt(req.query.itemId as string, 10);
        const clientSecret = req.query.clientSecret as string;
        const userId = res.locals.tokenInfo.id;
        try {
            if ((!itemId || !itemType) && (!clientSecret)) {
                return res.status(400).json({ error: 'Item not specified' });
            }
            const paymentIntent = clientSecret ? await getPaymentIntentRecordByClientSecret(clientSecret) : await getPaymentIntentRecord(itemType, itemId);
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