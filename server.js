const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/route");
// const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

app.use("/books", bookRoutes);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
