const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// session: false, means don't create cookies based session
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){

    // If we want add any protected route, use 'requireAuth' middleware
    // in the second arg to the route.
    app.get('/', requireAuth, (req, res) => {
        res.send({message: 'there'})
    });

    app.post('/signin', requireSignin, Authentication.signin);

    app.post('/signup', Authentication.signup);

};