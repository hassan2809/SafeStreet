import mongoose, { Schema } from "mongoose";

const MediaRequestSchema = new Schema(
  {
    report: { type: Schema.Types.ObjectId, ref: "Report", required: true },
    requestedBy: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mediaUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "uploaded", "approved", "rejected"],
      default: "pending",
    },
    inquiryText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const MediaRequest = mongoose.model("MediaRequest", MediaRequestSchema);
export default MediaRequest;
