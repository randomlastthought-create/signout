import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ShirtSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]{3,20}$/,
    },
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
  },
  { timestamps: true }
);

const StrokeSchema = new Schema(
  {
    points: { type: [Number], required: true },
    color: { type: String, required: true },
    size: { type: Number, required: true, min: 1, max: 40 },
  },
  { _id: false }
);

const SignatureSchema = new Schema(
  {
    shirtUsername: { type: String, required: true, index: true },
    strokes: { type: [StrokeSchema], required: true },
  },
  { timestamps: true }
);

export type Stroke = InferSchemaType<typeof StrokeSchema>;

export const Shirt =
  mongoose.models.Shirt || mongoose.model("Shirt", ShirtSchema);
export const Signature =
  mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);
