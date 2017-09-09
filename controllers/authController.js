const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  //first check if user is authenticated
  //passport method
  if(req.isAuthenticated()) {
    next();// they are logged in
    return;
  }
  req.flash('error', 'You must be logged in to add a store!');
  res.redirect('/login');
}

exports.forgot = async(req, res) => {
  //1 see if a user with that email exsits
  const user = await User.findOne({ email: req.body.email });
  if(!user){
    req.flash('error', 'No account with that email exsits.');
    return res.redirect('/login');
  } //2 Reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires= Date.now() + 36000000; // 1 hour from now
  await user.save();
  //3. send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${ user.resetPasswordToken}`;
  req.flash('success', `You have been emailed a password reset link. ${ resetURL}`);
  //4. redirect to login
  res.redirect('/login');


}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired.');
    return res.redirect('/login');
  }
  //rest password for
  res.render('reset', { title: 'Reset your password'});
};