import { Program } from '../models/Program.js';

export const getAllPrograms = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;

    const programs = await Program.find(query);
    res.json({ success: true, count: programs.length, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch programs.', error: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program record not found.' });
    }
    res.json({ success: true, program });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch program.', error: error.message });
  }
};

export const createProgram = async (req, res) => {
  try {
    const { title, institution, topic, date, image, images, description, category } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Program title is required.' });
    }
    if (!institution || !institution.trim()) {
      return res.status(400).json({ success: false, message: 'Institution / College name is required.' });
    }

    const newProgram = await Program.create({
      title: title.trim(),
      institution: institution.trim(),
      topic: topic ? topic.trim() : '',
      date: date || new Date().toISOString().split('T')[0],
      image: image || (images && images[0]) || '',
      images: Array.isArray(images) ? images : (image ? [image] : []),
      description: description ? description.trim() : '',
      category: category || 'Resource Person',
    });

    res.status(201).json({ success: true, message: 'Program event created successfully.', program: newProgram });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create program.', error: error.message });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    const updated = await Program.findByIdAndUpdate(id, req.body);
    res.json({ success: true, message: 'Program updated successfully.', program: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update program.', error: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    await Program.findByIdAndDelete(id);
    res.json({ success: true, message: 'Program event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete program.', error: error.message });
  }
};
