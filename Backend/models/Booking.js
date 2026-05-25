import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },
    amount: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
