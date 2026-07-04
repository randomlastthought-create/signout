import mongoose, { Schema, type InferSchemaType } from "mongoose";

const GiftSchema = new Schema(
  {
    bankName: { type: String, required: true, trim: true, maxlength: 50 },
    accountName: { type: String, required: true, trim: true, maxlength: 80 },
    accountNumber: { type: String, required: true, trim: true, maxlength: 20 },
  },
  { _id: false }
);

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
    gift: { type: GiftSchema, default: null },
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

const TextItemSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    text: { type: String, required: true, maxlength: 140 },
    color: { type: String, required: true },
    fontSize: { type: Number, required: true, min: 8, max: 96 },
    rotate: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const SignatureSchema = new Schema(
  {
    shirtUsername: { type: String, required: true, index: true },
    strokes: { type: [StrokeSchema], default: [] },
    texts: { type: [TextItemSchema], default: [] },
  },
  { timestamps: true }
);

export type Stroke = InferSchemaType<typeof StrokeSchema>;
export type TextItem = InferSchemaType<typeof TextItemSchema>;

export const Shirt =
  mongoose.models.Shirt || mongoose.model("Shirt", ShirtSchema);
export const Signature =
  mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);
