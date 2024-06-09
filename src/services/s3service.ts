import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: 'eu-central-1'
});

const uploadFile = async (file: Express.Multer.File, folderName: string): Promise<AWS.S3.ManagedUpload.SendData> => {
    const params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: `${folderName}/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    return s3.upload(params).promise();
};

export { uploadFile };