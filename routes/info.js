const router = require('express').Router();
const { v4:uuid4 } = require('uuid');
const Info = require('../models/info');
const ncp = require("copy-paste");

router.post('/', async (req,res)=>{
    const info = req.body.info;
    if(!info) {
        return res.status(400).json({
            status: 400,
            message: 'Error: All fields are required',
            data: null
        });
    }
    // Store into DB
    const information = new Info({
        information: info,
        uuid: uuid4()
    });
    const response = await information.save();
    return res.status(200).json({
        status: 200,
        message: 'Data set successfully',
        data: response
    });
});

router.get('/textCopy/:uuid', async (req,res)=>{
    try {
        const information = await Info.findOne({
            uuid: req.params.uuid
        });
        if(!information) {
            return res.render('download', {
                error: 'Link has been expired.',
                status: 400,
                message: 'Error: All fields are required',
                data: null
            });
        }
        ncp.copy(information.information, function () {
            return res.render('download', {
                error: 'Text Successfully copied.',
                status: 200,
                message: 'Text Successfully copied.',
                data: information.information,
            });
        })
    }catch(err) {
        return res.render('download', {
            error: 'Link has been expired.',
            status: 400,
            message: 'Error: Something went wrong.',
            data: null,
        });
    }
});

module.exports = router;