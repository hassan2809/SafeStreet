import mongoose, { Schema } from "mongoose";

const AdvertisementSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    link: { type: String }, // Redirect URL when clicked
    active: { type: Boolean, default: true },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
export default Advertisement;
