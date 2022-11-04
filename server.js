const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors =require("cors");

const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

const app = express();
// used to data  from body we need following middlewares 2 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cors());
app.use(cors({

    origin: ["https://docto-ray-frontend.vercel.app"],
    credentials: true,

}));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
