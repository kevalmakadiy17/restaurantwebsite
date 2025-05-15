import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'mainCourse', 'dessert', 'beverage']
  },
  imageUrl: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('MenuItem', menuItemSchema); 