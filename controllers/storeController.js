const mongoose = require('mongoose');
const Store = mongoose.model('Store');


exports.homePage = (req, res) => {
  console.log(req.name);
  req.flash('error', 'Soemthing happened');
  req.flash('info', 'Soemthing happened');
  req.flash('warning', 'Soemthing happened');
  req.flash('success', 'Soemthing happened');
  res.render('index'); //index file
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store'}); 
};

exports.createStore = async (req, res) => {
  const store = new Store (req.body);
  await store.save(); //don't move on until save has happened
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect('/');
};

exports.getStores = async (req, res) => {
  //Query the database for a list of all stores
  const stores = await Store.find();
  console.log(stores);
  res.render('stores', { title: 'Stores', stores: stores});
};

exports.editStore = async (req, res) => {
  //Find the store given the ID
  const store = await Store.findOne({_id: req.params.id });
  //Confirm they are the owner of the store.
  //Render out the edit form so user can udpate their store
  res.render('editStore', { title: `Edit ${store.name}`, store: store});
};

exports.updateStore = async (req, res) => {
  //find and update the store
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, //return the new store instead of the old
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name}`);
  res.redirect(`/stores/${store._qid}/edit`);
  //redirect them the store and tell them it worked
};