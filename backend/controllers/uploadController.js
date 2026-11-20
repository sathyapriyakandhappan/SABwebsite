export const uploadSingleImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed.', error: error.message });
  }
};

export const uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded.' });
    }
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully.`,
      urls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Multiple image upload failed.', error: error.message });
  }
};
