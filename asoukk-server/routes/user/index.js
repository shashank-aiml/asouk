const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/login/recover', require('./recover'));
router.use('/register', require('./register'));
router.use('/verify', require('./verify'));
router.use('/recover', require('./recover'));
router.use('/logout', require('./logout'));
router.use('/isAuth', require('./isAuth'));
router.use('/wishlist', require('./wishlist'));

module.exports = router;