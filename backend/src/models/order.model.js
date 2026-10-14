import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Número que ve el cliente, ej: VE-4821
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  // Relación con el Usuario (null si el pedido se hizo sin cuenta)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Cada item es un helado armado en la página "Ordenar"
  items: [
    {
      base: { type: String, required: true },
      flavors: [{ type: String }],
      toppings: [
        {
          name: String,
          price: Number
        }
      ],
      price: { type: Number, required: true }
    }
  ],
  delivery: {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    comentario: { type: String, default: '' }
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'preparando', 'en camino', 'entregado', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
