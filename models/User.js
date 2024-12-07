import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  profilePicture: { type: String, default: 'N/A' },
  streaks: { type: Number, default: 0 },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = Object.create(BaseModel);
UserModel.createUser = async function ({ username, email, passwordHash, salt }) {
  const user = await this.create({
    username,
    email,
    profilePicture: 'N/A',
    streaks: 0,
    passwordHash,
    salt,
  });
  return user._id;
};

UserModel.findByEmail = async function (email) {
  return this.findOne({ email });
};

UserSchema.loadClass(UserModel);

const User = mongoose.models.users || mongoose.model('users', UserSchema);
export default User;
