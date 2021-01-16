const express = require('express');

const router = express.Router();

//router.use('/ENDPOINT', require('./ENDPOINT'))

router.get('/', (req, res) => {
    res.json({'message': 'hello'});
});

module.exports = router;