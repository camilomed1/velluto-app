import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      enum: ['cliente', 'admin'],
      default: 'cliente'
    },
    telefono: {
      type: String,
      trim: true,
      default: ''
    },
    // Direcciones guardadas para no escribirlas en cada pedido
    direcciones: [
      {
        alias: { type: String, required: true, trim: true },
        direccion: { type: String, required: true, trim: true },
        comentario: { type: String, trim: true, default: '' },
        principal: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', userSchema)
