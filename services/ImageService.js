const AWS = require('aws-sdk');
const fs = require('fs');
const crypto = require('crypto');
const Category = require('../models/Category');

class ImageService {
    
    constructor() {
        this.BUCKET_NAME = 'techwebshop';
        this.s3bucket = new AWS.S3({
            accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
            region: 'eu-north-1'
        });
    }

    uploadImage = (fileName, name) => {
        const fileString = crypto.randomBytes(16).toString('hex');
        const params = { Bucket: this.BUCKET_NAME, Key: fileString + '.jpg', Body: fileName.data }
        
        this.s3bucket.upload(params, async (err, data) => {
            if (err) throw err;
            await Category.query().insert({ name, img_url: data.Location })
        });
    }

    deleteImage = async (id) => {
        const category = await Category.query().select('img_url').where('id', id);
        const params = { Bucket: this.BUCKET_NAME, Key: category[0].img_url.split('/')[3] }

        this.s3bucket.deleteObject(params, async (err, data) => {
            if (err) throw err;
            await Category.query().findById(id).delete();
            return;
        });
    }

}

module.exports = ImageService;