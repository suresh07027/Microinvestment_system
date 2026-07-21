import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  roundUpAmount: { type: Number, required: true },
  investedAmount: { type: Number, required: true },
  category: { type: String, default: 'general' },
  date: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)