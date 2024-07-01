import { createPaymentIntent, verifyStripeSignature } from './stripeService';
import { albumInfo } from '../db/dbInteractions/dbAlbum';
import { getPhotosInfo, labelPhotosAsPaid } from '../db/dbInteractions/dbPhoto';
import { labelAlbumAsPaid } from '../db/dbInteractions/dbAlbum';
import { getClientInfo as getClientInfoFromDb } from '../db/dbInteractions/dbClient';
import { addPaymentIntentRecord, getPaymentIntentRecord, updatePaymentIntentRecord } from '../db/dbInteractions/dbPayments';
import { CustomError } from '../middleware/errorHandler';

class PaymentService {
    public async createPaymentIntent(itemType: string, itemId: number, userId: number, email: string) {
        let info;
        if (itemType === 'photo') {
            info = await getPhotosInfo([itemId]);
        } else if (itemType === 'album') {
            info = await albumInfo(itemId);
        }

        if (!info || !info[0]) {
            throw new CustomError('Item not found', 404);
        } else if (info[0].paid) {
            throw new CustomError('Item already paid', 400);
        }

        const price = info[0].price * 100; // Convert to cents
        const metadata = { itemType, itemId, userId, email };
        const clientSecret = await createPaymentIntent(price, metadata) as string;
        await addPaymentIntentRecord(itemType, itemId, userId, clientSecret);
        return clientSecret;
    }

    public async handleWebhook(payload: Buffer, sig: string) {
        const event = verifyStripeSignature(payload, sig);
        if (event.type === 'payment_intent.succeeded') {
            const clientSecret = event.data.object.client_secret as string;
            const intentInfo = await getPaymentIntentRecord(clientSecret);
            if (!intentInfo || !intentInfo[0]) {
                throw new CustomError('Payment intent not found', 404);
            }
            if (intentInfo[0].itemType === 'photo') {
                await labelPhotosAsPaid([intentInfo[0].itemId]);
            } else if (intentInfo[0].itemType === 'album') {
                await labelAlbumAsPaid(intentInfo[0].itemId);
            }
            await updatePaymentIntentRecord(clientSecret, 'SUCCEEDED');
        } else if (event.type === 'payment_intent.payment_failed') {
            const clientSecret = event.data.object.client_secret as string;
            await updatePaymentIntentRecord(clientSecret, 'FAILED');
        }
    }

    public async getPaymentIntentStatus(clientSecret: string, userId: number) {
        const paymentIntent = await getPaymentIntentRecord(clientSecret);
        if (!paymentIntent || !paymentIntent[0]) {
            throw new CustomError('Payment intent not found', 404);
        }
        if (paymentIntent[0].userId !== userId) {
            throw new CustomError('Unauthorized', 403);
        }
        return paymentIntent[0].status;
    }

    public async getClientInfo(phoneNumber: string) {
        const userInfo = await getClientInfoFromDb(phoneNumber);
        if (!userInfo || !userInfo[0]) {
            throw new CustomError('Internal server error', 500);
        }
        return userInfo[0];
    }
}

const paymentService = new PaymentService();
export { paymentService };
