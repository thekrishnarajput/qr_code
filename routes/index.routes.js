const router = require('express').Router();

router.get('/', (request, response) => {
    response.render("index");
});

router.post('/scan', scanController.scan);

router.get('/claim-form/:amount', claimFormController.claim);

router.post('/claimed', claimedController.claimed);

module.exports = router;