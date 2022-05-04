const router = require('express').Router();

const claimFormController = require('../controller/claim.form.controller');
const claimedController = require('../controller/claimed.controller');

router.get('/claim-form/:amount', claimFormController.claim);

router.post('/claimed', claimedController.claimed)


module.exports = router;