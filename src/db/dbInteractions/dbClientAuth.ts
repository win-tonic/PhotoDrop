import { db, OtpType, ClientType } from "../db";
import { eq } from 'drizzle-orm';

export async function addOtpRecord(phoneNumber: string, otp: string, tryN: number) {
    await db.db.insert(db.otps)
        .values({ phoneNumber, otp, tryN, timeSent: new Date() })
}

export async function getOtpRecord(phoneNumber: string): Promise<OtpType[]> {
    const otpRecord = await db.db.select({ phoneNumber: db.otps.phoneNumber, otp: db.otps.otp, tryN: db.otps.tryN, timeSent: db.otps.timeSent })
        .from(db.otps)
        .where(eq(db.otps.phoneNumber, phoneNumber));
    return otpRecord;
}

export async function addTryN(phoneNumber: string, otp: string, prevN: number) {
    await db.db.update(db.otps)
        .set({ otp, tryN: prevN + 1, timeSent: new Date() })
        .where(eq(db.otps.phoneNumber, phoneNumber));
}

export async function clearOtpRecord(phoneNumber: string) {
    await db.db.delete(db.otps).where(eq(db.otps.phoneNumber, phoneNumber));
}

export async function checkIfClientExists(phoneNumber: string): Promise<0 | 1> {
    const client = await db.db.select().from(db.clients).where(eq(db.clients.phoneNumber, phoneNumber));
    if (client.length > 0) {
        return 1;
    }
    return 0;
}

export async function addClient(phoneNumber: string, name: string) {
    await db.db.insert(db.clients)
        .values({ phoneNumber, name })
}

export async function getClientInfo(phoneNumber: string): Promise<ClientType> {
    const info = await db.db.select({
        id: db.clients.id,
        phoneNumber: db.clients.phoneNumber,
        name: db.clients.name
    }).from(db.clients).where(eq(db.clients.phoneNumber, phoneNumber))
    return info[0];
}

// async function test() {
//     await addTryN('44444', '123456', 1)
// }

// test()

