const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () { return !this.googleId; }, // Required if no Google ID is present
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  googleId: {  // Google ID for users registered through Google OAuth
    type: String,
    unique: true,
    sparse: true  // This creates a partial index, only indexing docs with a googleId
  }
});

// Method to check the password on signin, only if password exists
userSchema.methods.isCorrectPassword = async function (password) {
  if (!this.password) return false;  // Return false if there is no password (Google user)
  return this.password === password;
};

module.exports = mongoose.model('User', userSchema);
