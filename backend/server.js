const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); // Note: Import dotenv directly for config
const connectToMongoDB = require('./db/connectToMongoDB.js'); // Adjust the path as needed
const authRoutes = require('./Routes/auth.routes.js'); // Authentication Route
const bodyParser = require('body-parser');
const student=require('./Routes/Students_Routes/students.routes.js');
const teacher=require('./Routes/Teacher_Routes/teacher.routes.js');
const app = express();
//const passport = require('./Utils/passport.js');
dotenv.config(); // Correctly call the config function
const PORT = process.env.PORT || 5000; // Assuming you have a PORT variable in your .env file or default to 3000
const cors=require("cors")
app.use(cors());
// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const app = express();
app.use(express.json()); // to parse the incoming requests with JSON payloads
app.use(cookieParser());

// Initialize Passport middleware
//app.use(passport.initialize());

app.use("/api/auth", authRoutes); //Authentication Route
app.use("/api/student",student);
app.use("/api/teacher",teacher);

connectToMongoDB();


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
