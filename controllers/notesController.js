import Note from '../models/Note.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';


// @desc   Get all notes
// @route  GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }
    
    // Helper function to add the username to a note
    const getNoteUsername = async (note) => {
        const user = await User.findById(note.user).lean();
        return { ...note, username: user.username };
    }

    // Add username to each note before sending the response 
    const notesWithUsername = await Promise.all(notes.map(async (note) => {
        return getNoteUsername(note);
    }));

    res.json(notesWithUsername);
});


// @desc   Create a new note
// @route  POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // Check for missing fields
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' });
    }

    // Confirm user exists
    const foundUser = await User.findById(user).lean();
    if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const note = await Note.create({ user, title, text });

    if (note) {
        res.status(201).json({ message: `New note ${title} created` });
    } else {
        res.status(400).json({ message: 'Invalid note data recieved' });
    }
});


// @desc  Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json({ message: `${updatedNote.title} updated` });
});


// @desc   Delete a note
// @route  DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();

    res.json({ message: `${result.deletedCount} note deleted` });
});


export { getAllNotes, createNewNote, updateNote, deleteNote };