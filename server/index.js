import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

//==========CONFIGURATIONS======
const __filename = fileURLToPath(import.meta.url); // to grab the file url , this only when we use type modules
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));//used to set the directory for assets , here it for images to store locally(am not using here S3 bucket)


//==========FILE STORAGE========
//Returns a StorageEngine implementation configured to store files on the local file system.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }); //using upload variable I am going to upload images

//=======ROUTES WITH FILES=========
//this is the API while user hit register from front end and this is the midleware responsible for"upload.single("picture")" uploading picture in locally
app.post("/auth/register", upload.single("picture"), register);

//========ROUTES=======
app.use("/auth", authRoutes);
app.use("/users",userRoutes);

//=========MONGOOSE SETUP===
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}).catch((err) => console.log(`${err} did not connect`));

