import { db, PaymentIntentType } from '../db';
import { eq, desc } from 'drizzle-orm';

export async function addPaymentIntentRecord(itemType: string, itemId: number, userId: number, clientSecret: string) {
    await db.db.insert(db.paymentIntents)
        .values({ itemType, itemId, userId, clientSecret, timeCreated: new Date(), status: 'PENDING' })
}

export async function getPaymentIntentRecord(clientSecret: string): Promise<PaymentIntentType[]> {
    const paymentIntent = await db.db.select({ id: db.paymentIntents.id, itemType: db.paymentIntents.itemType, itemId: db.paymentIntents.itemId, userId: db.paymentIntents.userId, clientSecret: db.paymentIntents.clientSecret, timeCreated: db.paymentIntents.timeCreated, status: db.paymentIntents.status })
        .from(db.paymentIntents)
        .where(eq(db.paymentIntents.clientSecret, clientSecret));
    return paymentIntent;
}

export async function updatePaymentIntentRecord(clientSecret: string, status: string) {
    await db.db.update(db.paymentIntents)
        .set({ status })
        .where(eq(db.paymentIntents.clientSecret, clientSecret))
}

