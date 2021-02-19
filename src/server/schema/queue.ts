import { model, ObjectId, Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: ObjectId;
    username: string;
    staff: string[];
    isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, trim: true, required: true, unique: true },
    staff: [String],
});

export const User = model<IUser>("User", UserSchema);
