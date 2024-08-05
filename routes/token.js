var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/', async function(req, res, next) {
    const payload = {
        data: 'secret info shhh'
    }

    const secret = process.env.TOKEN_SECRET
    const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
    })

    res.render('ticket', {username: req.cookies['username'], token})
})

module.exports = router;
