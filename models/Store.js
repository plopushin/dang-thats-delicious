const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slugs'); //make url friendly names

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, //take out the white spaces
    required: 'Please enter a store name.'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    }, 
    coordinates: [{
      type: Number, 
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String
});

storeSchema.pre('save', function(next) {
  if(!this.isModified('name')) {
    next(); //skip
    return ;
  }
  this.slug = slug(this.name); //set slug to the name
  next(); //like a middleware
});

module.exports = mongoose.model('Store', storeSchema);