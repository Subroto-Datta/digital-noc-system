const NocRequest = require('../models/NocRequest');

const createNoc = async (req, res) => {
  try {
    const { title, department, purpose, description, status } = req.body;
    const studentId = req.user.id;

    const newNOC = new NocRequest({
      student: studentId,
      title,
      department,
      purpose,
      description,
      status: status || "Pending",
    });

    const savedNoc = await newNOC.save();
    res.status(201).json(savedNoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create NOC" });
  }
};


const getNocById = async (req, res) => {
  const noc = await NocRequest.findById(req.params.id).populate('student', 'name email');
  
  if (!noc) {
    res.status(404); // Set the status code
    throw new Error('NOC request not found');
  }
  
  res.json(noc);
};

// @desc    Get all NOC requests for a specific user
const getNocsForUser = async (req, res) => {
  const nocs = await NocRequest.find({ student: req.params.userId });
  res.json(nocs);
};

// @desc    Update an existing NOC request
const updateNoc = async (req, res) => {
  const updatedNOC = await NocRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedNOC) {
    res.status(404);
    throw new Error('NOC request not found');
  }

  res.json(updatedNOC);
};

// @desc    Delete an NOC request
const deleteNoc = async (req, res) => {
  const deletedNoc = await NocRequest.findByIdAndDelete(req.params.id);
  
  if (!deletedNoc) {
    res.status(404);
    throw new Error('NOC request not found');
  }

  res.json({ message: 'NOC request deleted successfully' });
};

module.exports = {
  createNoc,
  getNocById,
  getNocsForUser,
  updateNoc,
  deleteNoc,
};