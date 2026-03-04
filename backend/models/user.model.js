import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    customId: {
      type: Number,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin", "client"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew && !doc.customId) {
    let unique = false;
    let newId;

    while (!unique) {
      newId = Math.floor(100000 + Math.random() * 900000);
      const existing = await mongoose.models.User.findOne({ customId: newId });
      if (!existing) unique = true;
    }

    doc.customId = newId;
  }

  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
