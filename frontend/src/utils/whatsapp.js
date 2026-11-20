export const PRIMARY_WHATSAPP = '918248010800';
export const SECONDARY_WHATSAPP = '919865778873';
export const SAB_EMAIL = 'sabsenthil1@gmail.com';
export const SAB_ADDRESS = '161 Pudukkottai Main Road, Thirukkanurpatti - 613 303, Thanjavur District, Tamil Nadu';
export const SAB_PROPRIETOR = 'Dr. R. Senthilkumar';
export const SAB_YOUTUBE_URL = 'https://youtube.com/@sriammanbiocare3348?si=ZbRGwpN8QAxrovus';
export const SAB_GOOGLE_MAPS_URL = 'https://www.google.com/search?client=ms-android-oppo-rvo3&hs=YGhB&sca_esv=9e33dd2ec71b771c&hl=en-IN&cs=0&sxsrf=AKL5yDjU9qvMS1w2cQzW5yJj9WBzigdblw%3A1795093993317&kgmid=%2Fg%2F11grc70xjf&q=Sri%20Amman%20Biocare&shem=dlvs1%2Cepsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Funi%2Fm1%2F4&kgs=cd8c765abedd6ad5';

export const buildWhatsAppUrl = (data = {}) => {
  const {
    name = '',
    phone = '',
    email = '',
    company = '',
    productName = 'General Enquiry',
    message = '',
  } = data;

  const lines = [
    '🌱 *SRI AMMAN BIOCARE - OFFICIAL ENQUIRY* 🌱',
    `*Proprietor:* Dr. R. Senthilkumar`,
    `*Address:* 161 Pudukkottai Main Road, Thirukkanurpatti - 613 303, Thanjavur`,
    '--------------------------------------',
    name ? `👤 *Customer Name:* ${name}` : null,
    phone ? `📞 *Phone:* ${phone}` : null,
    email ? `✉️ *Email:* ${email}` : null,
    company ? `🏢 *Farm / College / Org:* ${company}` : null,
    productName ? `🌾 *Product / Service:* ${productName}` : null,
    '--------------------------------------',
    message ? `📝 *Enquiry Message:* \n${message}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${PRIMARY_WHATSAPP}?text=${text}`;
};

export const logEnquiryToDB = async (payload = {}) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name || 'WhatsApp Visitor',
        email: payload.email || 'farmer@sriammanbiocare.com',
        phone: payload.phone || 'Contacted via WhatsApp (+91 82480 10800)',
        company: payload.company || 'Website Lead',
        productName: payload.productName || 'Direct WhatsApp Inquiry',
        message: payload.message || 'Customer initiated WhatsApp chat with Sri Amman Biocare',
      }),
    });
  } catch (err) {
    console.warn('[Lead Log Notice]:', err.message);
  }
};

export const openWhatsAppDirect = (customText = '', leadInfo = {}) => {
  // Extract product or topic if present in customText
  let detectedProduct = leadInfo.productName || 'WhatsApp Direct Advisory';
  if (customText) {
    if (customText.includes('Paddy special') || customText.includes('Paddy Special')) {
      detectedProduct = 'Paddy special - compo of 3 biofertilizer';
    } else if (customText.includes('Biofertilizer')) {
      detectedProduct = 'Biofertilizer Products';
    } else if (customText.includes('training') || customText.includes('Internship') || customText.includes('internship')) {
      detectedProduct = 'Training & Internship';
    } else if (customText.includes('Industrial Visit')) {
      detectedProduct = 'Industrial Visit / Institutional Session';
    }
  }

  // 1. Automatically store enquiry in Database for Admin Panel!
  logEnquiryToDB({
    name: leadInfo.name || 'WhatsApp Visitor',
    phone: leadInfo.phone || 'WhatsApp Direct (82480 10800)',
    email: leadInfo.email || 'farmer@sriammanbiocare.com',
    productName: detectedProduct,
    message: customText || 'Visitor clicked direct WhatsApp button to contact Dr. R. Senthilkumar',
    company: leadInfo.company || 'Website Direct',
  });

  // 2. Open WhatsApp window
  const defaultText = encodeURIComponent(
    customText ||
    'வணக்கம்! Sri Amman Biocare (Dr. R. Senthilkumar). I would like to enquire about your Biofertilizers / Vermicompost / Training / Student Internships.'
  );
  window.open(`https://wa.me/${PRIMARY_WHATSAPP}?text=${defaultText}`, '_blank');
};
