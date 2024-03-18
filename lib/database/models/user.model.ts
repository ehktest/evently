import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
    // events: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Event koleksiyonuna referanslar
    // orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Order koleksiyonuna referanslar
  },
  { collection: "user", timestamps: false }
);

const User = models.User || model("User", UserSchema);

export default User;
