const router = require('express').Router();
const Info = require('../models/info');

router.get('/:uuid', async (req,res) => {
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
        return res.render('download', {
            uuid: information.uuid,
            fileName: `${information.information}`,
            fileSize: 'NULL',
            downloadLink: `${process.env.APP_BASE_URL}/api/info/textCopy/${information.uuid}`
        });
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