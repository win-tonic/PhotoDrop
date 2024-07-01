import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { CustomError } from '../middleware/errorHandler';

class PaymentController {
    constructor() {
        this.createPayment = this.createPayment.bind(this);
        this.webhook = this.webhook.bind(this);
        this.getPaymentIntentStatus = this.getPaymentIntentStatus.bind(this);
    }

    public async createPayment(req: Request, res: Response) {
        const { itemType, itemId } = req.body;
        const userId = res.locals.tokenInfo.id;
        const phoneNumber = res.locals.tokenInfo.phoneNumber;
        let email = res.locals.tokenInfo.email;

        if (!itemId || !itemType) {
            throw new CustomError('Item not specified', 400);
        }

        if (!email) {
            const userInfo = await paymentService.getClientInfo(phoneNumber);
            if (!userInfo) {
                throw new CustomError('Internal server error', 500);
            }
            email = userInfo.email;
        }

        const clientSecret = await paymentService.createPaymentIntent(itemType, itemId, userId, email);
        res.status(200).json({ clientSecret });
    }

    public async webhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        await paymentService.handleWebhook(req.body, sig);
        res.status(200).json({ received: true });
    }

    public async getPaymentIntentStatus(req: Request, res: Response) {
        const clientSecret = req.query.clientSecret as string;
        const userId = res.locals.tokenInfo.id;

        if (!clientSecret) throw new CustomError('Item not specified', 400);

        const paymentStatus = await paymentService.getPaymentIntentStatus(clientSecret, userId);
        res.status(200).json({ paymentStatus });
    }
}

const paymentController = new PaymentController();
export { paymentController };