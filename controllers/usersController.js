import User from '../models/User.js';
import Note from '../models/Note.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';


// @desc   Get all users
// @route  GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
}); 



// @desc   Create a new user
// @route  POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    const userObject = {
        username,
        password: hashedPassword,
        roles
    }

    // Create && store new user
    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data recieved' });
    }
});



// @desc   Update a new user
// @route  PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // Confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec();
    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10); // 10 salt rounds  
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});

// @desc   Delete a new user
// @route  DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    }

    const note = await Note.find({ user: id }).lean().exec();
    console.log(note)
    if (note.length > 0) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();
    
    const reply = `Username ${user.username} with ID ${user._id} deleted`;
    res.json(reply);
});



export { getAllUsers, createNewUser, updateUser, deleteUser };