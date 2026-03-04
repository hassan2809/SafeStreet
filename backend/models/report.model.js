import mongoose, { Schema } from "mongoose";

const VehicleSchema = new Schema({
  registration: {
    type: String,
  },
  registrationState: {
    type: String,
    enum: [
      "ACT",
      "NSW",
      "NT",
      "QLD",
      "SA",
      "TAS",
      "VIC",
      "WA",
      "HEAVY VEHICLE",
      "OTHER",
    ],
    default: "NSW",
  },
  make: {
    type: String,
  },
  vehicleColour: {
    type: String,
  },
  model: {
    type: String,
  },
  bodyType: {
    type: String,
    enum: [
      "Sedan",
      "Utility",
      "Wagon",
      "Motorcycle",
      "Hatchback",
      "Coupe",
      "Trailer",
      "Other",
    ],
    default: "Sedan",
  },
  identifyingFeatures: {
    type: String,
    default: "",
  },
  isRegistrationVisible: {
    type: String,
    enum: ["Yes", "No", "Unknown"],
    default: "Unknown",
  },
});

const WitnessInfoSchema = new Schema(
  {
    info: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      default: null,
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    customId: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    incidentType: {
      type: String,
      enum: [
        "Collision",
        "Excessive Speed",
        "Road Rage",
        "Hoon Driving (Including burnouts, racing)",
        "Tailgating",
        "Dangerous/Reckless Driving",
        "Request For Information",
        "Other",
      ],
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "Truck", "Motorcycle", "Bus", "Other"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    hasDashcam: {
      type: Boolean,
      default: false,
    },
    hasAudio: {
      type: Boolean,
      default: false,
    },
    canProvideFootage: {
      type: Boolean,
      default: false,
    },
    acceptTerms: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    streetNumber: {
      type: String,
      default: "",
    },
    crossStreet: {
      type: String,
      default: "",
    },
    suburb: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: [
        "ACT",
        "NSW",
        "NT",
        "QLD",
        "SA",
        "TAS",
        "VIC",
        "WA",
        "HEAVY VEHICLE",
        "OTHER",
      ],
      default: "NSW",
    },
    vehicles: [VehicleSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminComments: {
      type: String,
      default: "",
    },
    witnessInfo: {
      type: [WitnessInfoSchema],
      default: [],
    },
  },
  { timestamps: true }
);

ReportSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew && !doc.customId) {
    let unique = false;
    let newId;

    while (!unique) {
      newId = Math.floor(100000 + Math.random() * 900000);
      const existing = await mongoose.models.Report.findOne({ customId: newId });
      if (!existing) unique = true;
    }

    doc.customId = newId;
  }

  next();
});

const Report = mongoose.model("Report", ReportSchema);
export default Report;
