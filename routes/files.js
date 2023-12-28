const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4:uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

let upload = multer({
    storage,
    limits: {
        filesize: 1000000 * 100
    }
}).single('myfile');

router.post('/',(req,res)=>{
    // Store file
    upload(req,res, async (err)=>{
        // Validate Request
        if(!req.file) {
            return res.json({
                error: 'All fields are required'
            });
        }

        if(err) {
            return res.status(500).send({
                status: 400,
                message: err.message,
                data: null
            });
        }

        // Store into DB
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        return res.status(500).json({
            status: 200,
            message: 'File uploaded sucessfully.',
            data: response,
            file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
        });
    });
});

router.post('/send', async (req,res)=>{
    // Validate
    const { uuid, emailTo, emailFrom } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({
            status: 422,
            message: 'All field are required.',
            data: null
        });
    }

    // Get data from DB
    const file = await File.findOne({ uuid: uuid});

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // Send Email
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'FileFlyer Share | Inshare',
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + ' KB',
            expires: '24 Hours'
        })
    });
    return res.status(200).send({
        status: 200,
        message: 'Email sent successfully.',
        data: response
    });
});

module.exports = router;