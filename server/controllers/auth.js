import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

//=========register user=====
export const register = async function (req, res) {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//=====logging in======
export const login = async function (req, res) {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist. " });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials. " });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;//delete the password so it doesn't sent to the frontend to kept safe

        res.status(200).json({ token, user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

