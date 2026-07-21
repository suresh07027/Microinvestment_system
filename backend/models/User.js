import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roundUpEnabled: { type: Boolean, default: true },
  roundUpLevel: { type: Number, default: 10 },
  minAmount: { type: Number, default: 5 },
  maxAmount: { type: Number, default: 100 },
  totalInvested: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  buckets: {
    gold: { type: Number, default: 25 },
    etf: { type: Number, default: 25 },
    indexFund: { type: Number, default: 25 },
    debtFund: { type: Number, default: 25 },
  },
  bucketAmounts: {
    gold: { type: Number, default: 0 },
    etf: { type: Number, default: 0 },
    indexFund: { type: Number, default: 0 },
    debtFund: { type: Number, default: 0 },
  },
  resetPasswordTokenHash: { type: String, default: null, select: false },
  resetPasswordExpires: { type: Date, default: null, select: false },
  resetPasswordLastRequestedAt: { type: Date, default: null, select: false },
}, { timestamps: true })

export default mongoose.model('User', userSchema)