const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy - for sign in
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy( localOptions, async (email, password, done) => {
    // Verify username and password, call done with the user if it is
    // the correct username/password. Otherwise, call done with false

    try {
        const user = await User.findOne({email});

        if(!user){
            return done(null, false);
        }

        // compare passwords - is `password` equal to user.password?
        user.comparePassword(password, function(err, isMatch){
            if(err) { return done(err); }
            if(!isMatch) { return done(null, false); }
            return done(null, user);
        });
    } catch (err) {
        return done(err);
    }

});


// Setup options for JWT Strategy ------------
// We need to tell this specific strategy where to look to find the
// JWT token.
// We need to also tell the strategy what the secret is to decode the payload
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy --------------
// - payload is the decoded JWT token
// - done is a callback that we call to determine if we were able
//   to successfully authenticate the user
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    // See if the user ID in the payload exists in our database
    // If so, call 'done' with that user object
    // Otherwise, call done w/o a user object
    try {
        const user = await User.findById(payload.sub);

        if(user){
            // search succeeded, pass in the user
            done(null, user);
        } else {
            // null, as in, the search succeeded, but a user wasn't found
            done(null, false); // false, as in, we didn't find the user
        }

    } catch(err) {
        // err, as in the search failed
        done(err, false); // false, as in, we didn't find the user
    }
});

// Tell passport to use this strategy ---------------------------
passport.use(jwtLogin);
passport.use(localLogin);