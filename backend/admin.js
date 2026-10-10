require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGO_URI and JWT_SECRET in the backend environment before running this script.");
  }

  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD. ADMIN_PASSWORD must be at least 12 characters.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: "Sole Market Admin",
          email,
          password: hashedPassword,
          role: "admin",
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("Admin account created or updated successfully.");
  } catch (error) {
    console.error("Error creating/updating admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
