import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: 'eu-central-1'
});

export async function uploadFile(buffer: Buffer, mimetype: string, folder: string, filename: string): Promise<{ Location: string }> {
    const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: `${folder}/${filename}`,
        Body: buffer,
        ContentType: mimetype
    };

    const uploadResult = await s3.upload(params).promise();
    return {
        Location: uploadResult.Location
    };
}