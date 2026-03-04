import mongoose, { Schema } from "mongoose";

const PaymentDetailsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    accountName: { type: String, required: true },
    bsb: { type: String, required: true },
    accountNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const PaymentDetails = mongoose.model("PaymentDetails", PaymentDetailsSchema);
export default PaymentDetails;
