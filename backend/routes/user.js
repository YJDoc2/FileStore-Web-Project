const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const User = require('../models/User');

router.post('/register', async (req, res) => {
    let { username, password } = req.body;
    if (username === undefined || password === undefined) {
        return res.status(400).send({
            success: false,
            err: 'Please Provide an Username'
        });
    }
    try {
        let hash = bcrypt.hashSync(password, 10);
        let user = await User.create({ username: username, password: hash });

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.status(200).send({
                success: true,
                user: user
            });
            return;
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send({
                success: false,
                err:
                    'This username is already taken, please choose another one.'
            });
        } else {
            console.error(err);
            res.status(500).send({
                success: false,
                err: 'Server error'
            });
        }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.status(400).send({
                success: false,
                err: info.message
            });
            return;
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.status(200).send({
                success: true,
                user: user
            });
            return;
        });
    })(req, res, next);
});

router.get('/user', ensureAuthenticated, (req, res) => {
    res.status(200).send({ user: req.user });
});

router.post('/logout', function(req, res) {
    req.logout();
    res.status(200).send({ success: true });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send({
            success: false,
            err: 'Authentication Error. Please Sign In.'
        });
    }
}

module.exports = router;
