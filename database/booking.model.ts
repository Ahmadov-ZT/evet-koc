import "server-only";
import { model, models, Schema, Types, type Model } from "mongoose";
import { Event } from "./event.model";

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [emailPattern, "Please provide a valid email address."],
    },
  },
  { timestamps: true }
);

// منع التكرار: حجز واحد فقط لكل إيميل لنفس الفعالية
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// التحقق من وجود الفعالية قبل الحفظ
bookingSchema.pre("save", async function () {
  if (this.isModified("eventId") || this.isNew) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Cannot create a booking for an event that does not exist.");
    }
  }
});

export const BookingModel: Model<Booking> =
  (models.Booking as Model<Booking> | undefined) ??
  model<Booking>("Booking", bookingSchema);

export { BookingModel as Booking };