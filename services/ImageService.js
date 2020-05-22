const AWS = require('aws-sdk');
const fs = require('fs');
const crypto = require('crypto');

class ImageService {
    
    constructor() {
        this.BUCKET_NAME = 'techwebshop';
        this.s3bucket = new AWS.S3({
            accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
            region: 'eu-north-1'
        });
    }

    uploadImage = (fileName) => {
        return new Promise((resolve, reject) => {
            const fileString = crypto.randomBytes(16).toString('hex');
            const params = { Bucket: this.BUCKET_NAME, Key: fileString + '.jpg', Body: fileName.data }
            
            this.s3bucket.upload(params, async (err, data) => {
                if (err) reject(err);
                resolve(data.Location);
            });
        })
    }

    deleteImage = async (key) => {
        const params = { Bucket: this.BUCKET_NAME, Key: key}
        return new Promise((resolve, reject) => {
            this.s3bucket.deleteObject(params, async (err, data) => {
                if (err) reject(err);
                resolve();
            });
        })
    }
}

module.exports = ImageService;