import mongoose from 'mongoose';

// Un producto puede ser un sabor de helado, una base (cono, vaso...) o un topping
const productSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['sabor', 'base', 'topping'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Solo para sabores
  category: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  disponible: {
    type: Boolean,
    default: true
  },
  // Solo para sabores: aparece en el carrusel de la página de inicio
  destacado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
