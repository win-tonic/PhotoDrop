import AWS from 'aws-sdk';
import {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_NAME} from '../config/config';

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});

export async function uploadFile(buffer: Buffer, mimetype: string, folder: string, filename: string): Promise<{ key: string }> {
    const params = {
        Bucket: BUCKET_NAME,
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
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 3600
    };

    const url = s3.getSignedUrl('getObject', params);

    return url;
};

// generatePresignedUrl('photos/watermarked/dummy image.jpeg').then(console.log);