import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  motivo: {
    type: String,
    enum: ['pedido', 'franquicia', 'sugerencia'],
    default: 'pedido'
  },
  mensaje: {
    type: String,
    required: true
  },
  leido: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);
