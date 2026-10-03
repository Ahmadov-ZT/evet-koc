import "server-only";

import { model, models, Schema, type Model } from "mongoose";

export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(value: string): string {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    if (
      date.getUTCFullYear() !== Number(year) ||
      date.getUTCMonth() !== Number(month) - 1 ||
      date.getUTCDate() !== Number(day)
    ) {
      throw new Error("Event date must be a valid date.");
    }

    return date.toISOString().slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  // Store all accepted date inputs as an ISO UTC calendar date.
  return date.toISOString().slice(0, 10);
}

function normalizeTime(value: string): string {
  const timeParts = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?\s*(AM|PM)?$/i.exec(
    value.trim(),
  );

  if (!timeParts) {
    throw new Error("Event time must be a valid 24-hour or 12-hour time.");
  }

  let hour = Number(timeParts[1]);
  const minute = timeParts[2];
  const meridiem = timeParts[3]?.toUpperCase();

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      throw new Error("12-hour event times must use an hour from 1 to 12.");
    }
    hour = (hour % 12) + (meridiem === "PM" ? 12 : 0);
  } else if (hour > 23) {
    throw new Error("24-hour event times must use an hour from 0 to 23.");
  }

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

const eventSchema = new Schema<Event>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      trim: true,
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (items: string[]) =>
          items.length > 0 && items.every((item) => item.trim().length > 0),
        message: "Event agenda must contain at least one non-empty item.",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (items: string[]) =>
          items.length > 0 && items.every((item) => item.trim().length > 0),
        message: "Event tags must contain at least one non-empty item.",
      },
    },
  },
  { timestamps: true }
);

// Generate slug before Mongoose's required-field validation runs
eventSchema.pre("validate", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
});

eventSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize values at persistence time so stored dates and times are consistent.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

// Indexes for performance and uniqueness
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ date: 1, mode: 1 });

export const Event: Model<Event> =
  (models.Event as Model<Event> | undefined) ??
  model<Event>("Event", eventSchema);