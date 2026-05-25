import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    tag: { type: String, enum: ["VIP", "Repeat", "Commercial", "Homeowner"], default: "Homeowner" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userSchema.virtual("password").set(function setPassword(password) {
  this._password = password;
});

userSchema.pre("validate", async function hashPasswordBeforeValidation(next) {
  if (this.isNew && !this.passwordHash && !this._password) {
    this.invalidate("password", "Password is required");
    return next();
  }

  if (this._password) {
    this.passwordHash = await bcrypt.hash(this._password, 12);
    this._password = undefined;
  }

  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    role: this.role,
    tag: this.tag,
    joinedAt: this.joinedAt,
  };
};

export default mongoose.model("User", userSchema);
