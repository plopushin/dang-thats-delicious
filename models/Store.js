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

storeSchema.pre('save', async function(next) {
  if(!this.isModified('name')) {
    next(); //skip
    return ;
  }
  this.slug = slug(this.name); //set slug to the name
  //check if other stores have the same name
  const slugRegEx = new RegExp (`^(${this.slug})((-[0-9]*$)?)$`, 'i');

  const storesWithSlug = await this.constructor.find({ slug: slugRegEx});
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next(); //like a middleware
});

module.exports = mongoose.model('Store', storeSchema);