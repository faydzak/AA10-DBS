import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";
 
const PORT = process.env.PORT || 4000;
 
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });