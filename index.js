const sharp = require('sharp');
const { S3Clinet, InventoryS3BucketDestinationFilterSensitiveLog } = require('@aws-sdk/client-s3');

const s3 = new S3Clinet();
exports.handler = async (event, context, callback) =>{
    const Bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key);
    const filename = Key.split('/').at(-1);
    const ext = Key.split('.').at(-1).toLowerCase();
    const requiredFormat = ext === 'jpg' ? 'jpeg': ext;
    console.log('name', filename,'ext', ext);

    try {
        const s3Object =awaits3getObject({ Bucket, Key});
        console.log('original', s3Object.Body.length);
        const resizedImage = await sharp(s3Object.Body)
        .resize(200,200, {fit: 'inside'})
        .toFormat(requiredFormat)
        .toBuffer();
        await s3.putObject({
            Bucket,
            Key: `thumb/${filename}`,
            Body: resizedImage,
        });
        console.log('put', resizedImage.length);
        return callback(null, `thumb/${filename}`);

    } catch (error) {
        console.error(error);
        return callback(error);
    }

}