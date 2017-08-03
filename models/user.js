const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Define the model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', async function(next) {
    // user is a specific instance of the user model
    const user = this;

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(10);
        // hash (encrypt) our password using the salt
        // Overwrite the plain text password w/ encrypted password
        user.password = await bcrypt.hash(user.password, salt, null);
        // next() to say 'go ahead and save the model'
        next();
    } catch(err)  {
        return next(err);
    }

});

// Whenever we create a user object, its going to have access to any
// functions that we define on the methods property
userSchema.methods.comparePassword = async function(candidatePassword, callback) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        callback(null, isMatch);
    } catch (err) {
        return callback(err);
    }
};

// Create the model class - represents ALL users
// 'user' is the collection. The schema corresponds to this collection.
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;