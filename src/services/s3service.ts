import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: 'eu-central-1'
});

export async function uploadFile(buffer: Buffer, mimetype: string, folder: string, filename: string): Promise<{ key: string }> {
    const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: `${folder}/${filename}`,
        Body: buffer,
        ContentType: mimetype
    };

    const uploadResult = await s3.upload(params).promise();
    return {
        key: uploadResult.Key
    };
}

export const generatePresignedUrl = (key: string): string => {
    const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Expires: 3600
    };

    const url = s3.getSignedUrl('getObject', params);

    return url;
};

// generatePresignedUrl('photos/watermarked/dummy image.jpeg').then(console.log);