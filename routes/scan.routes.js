const router = require('express').Router();

const scanController = require('../controller/scan.controller');

router.post('/qrcode', scanController.scan);

module.exports = router;