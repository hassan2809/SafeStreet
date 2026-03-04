import mongoose, { Schema } from 'mongoose';

const AnalyticsDataSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['incident', 'location', 'driver_profile'],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const AnalyticsData = mongoose.model('AnalyticsData', AnalyticsDataSchema);
export default AnalyticsData;

