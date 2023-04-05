import Post from "../models/Post.js";
import User from "../models/User.js";


//========CREATE======
export const createPost = async function (req, res) {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });


        await newPost.save();

        const post = await Post.find();

        res.status(201).json(post);
    } catch (err) {
        return res.status(409).json({ message: err.message });
    }
}


//========READ==========
export const getFeedPosts = async function (req, res) {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async function (req, res) {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}


//==========UPDATE======
export const likePost = async function (req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);
        const isLike = post.likes.get(userId);

        if (isLike) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}