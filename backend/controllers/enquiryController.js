import { Enquiry } from '../models/Enquiry.js';

export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, company, productId, productName, message } = req.body;

    const customerName = name && name.trim() ? name.trim() : 'Website Customer';
    const customerPhone = phone && phone.trim() ? phone.trim() : 'Contacted via Website / WhatsApp';
    const customerMessage = message && message.trim() ? message.trim() : `Customer expressed interest in ${productName || 'Sri Amman Biocare products'}`;
    
    // Email validation only if provided; otherwise fallback to farmer@sriammanbiocare.com
    let customerEmail = 'farmer@sriammanbiocare.com';
    if (email && email.trim()) {
      const trimmedEmail = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmedEmail)) {
        customerEmail = trimmedEmail;
      }
    }

    const newEnquiry = await Enquiry.create({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      company: company ? company.trim() : '',
      productId: productId || '',
      productName: productName ? productName.trim() : 'General Enquiry',
      message: customerMessage,
      status: 'Pending',
      notes: '',
    });

    console.log(`[Enquiry] New enquiry logged in database: ${newEnquiry.name} (${newEnquiry.phone}) for ${newEnquiry.productName}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Sri Amman Biocare! Your enquiry has been received and our technical team will contact you shortly.',
      enquiry: newEnquiry,
    });
  } catch (error) {
    console.error('[Enquiry] Error creating enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry.', error: error.message });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    let enquiries = await Enquiry.find({});

    if (status && status !== 'all') {
      enquiries = enquiries.filter(e => e.status === status);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      enquiries = enquiries.filter(e =>
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term)) ||
        (e.phone && e.phone.toLowerCase().includes(term)) ||
        (e.company && e.company.toLowerCase().includes(term)) ||
        (e.productName && e.productName.toLowerCase().includes(term)) ||
        (e.message && e.message.toLowerCase().includes(term))
      );
    }

    // Sort by latest
    enquiries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.', error: error.message });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enquiry.', error: error.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await Enquiry.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const updateData = {};
    if (status) {
      const validStatuses = ['Pending', 'Contacted', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updated = await Enquiry.findByIdAndUpdate(id, updateData);

    res.json({
      success: true,
      message: 'Enquiry status updated successfully.',
      enquiry: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update enquiry.', error: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Enquiry.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    await Enquiry.findByIdAndDelete(id);
    res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete enquiry.', error: error.message });
  }
};
