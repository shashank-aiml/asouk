const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/', require('./products'));
router.use('/home', require('./home'));

module.exports = router;