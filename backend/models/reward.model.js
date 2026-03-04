import mongoose, { Schema } from 'mongoose';

const RewardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    amount: {
      type: Schema.Types.Int32,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true,
    },
  },
  { timestamps: true }
);

const Reward = mongoose.model('Reward', RewardSchema);
export default Reward;