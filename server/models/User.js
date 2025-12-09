import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const ColumnSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    color: { type: String, required: true },
    items: [ItemSchema],
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    columns: {
      type: [ColumnSchema],
      default: [
        { id: "col-ideas", title: "Ideas", color: "yellow", items: [] },
        { id: "col-scripting", title: "Scripting", color: "blue", items: [] },
        { id: "col-filming", title: "Filming", color: "red", items: [] },
        { id: "col-posted", title: "Posted", color: "green", items: [] },
      ],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
