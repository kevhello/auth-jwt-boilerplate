const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

function tokenForUser(user) {
    // As a convention, JWT have a sub property (subject)
    // As a convention, iat stands for 'Issued At Time'
    const timestamp = new Date().getTime();
    return jwt.sign({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them the token
    res.send({token: tokenForUser(req.user)});
};

exports.signup = async function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({error: 'You must provide email and password'});
    }

    try {
        // See if a user w/ given email exists
        const existingUser =  await User.findOne({email});
        // If a user w/ email does exist, return an error
        if(existingUser){
            return res.status(422);
        }

        // If a user w/ email doesn't exist, create & save user record
        const user = new User({email, password});
        await user.save();

        // Respond to request indicating the user was created
        res.json({token: tokenForUser(user)});
    } catch(e){
        if (e) {
            return next(e);
        }
    }
};

