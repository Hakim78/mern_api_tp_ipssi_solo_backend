const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        if(!req.body.password) {  // Correction de "passowrd" en "password"
            return res.status(400).send({error: "Password is required"});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
};
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).send({error : 'User not found'});
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(400).send({error: 'Invalid password'});
        }

        const token = jwt.sign(
            { id: user._id, email: user.email}, // payload
            process.env.JWT_SECRET, // secret key
            { expiresIn: process.env.JWT_EXPIRES_IN } // expires in 1 hour
        );

        res.status(200).send({message: "Login successful", token});
    }   catch (error) {
        res.status(400).send({ error: error.message});
    };
}

const getUser= async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ error: error.message});
    }
};

const updateUser= async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
};
