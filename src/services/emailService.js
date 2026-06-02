import emailjs from '@emailjs/browser';

export const sendReceiptEmail = async (booking, isAdminCopy = false) => {
  const recipientEmail = isAdminCopy
    ? import.meta.env.VITE_ADMIN_EMAIL
    : booking.customerEmail;

  console.log(`========== Sending ${isAdminCopy ? 'ADMIN' : 'CUSTOMER'} email ==========`);
  console.log('Recipient email:', recipientEmail);
  console.log('Booking object:', JSON.stringify(booking, null, 2));
  console.log('Environment VITE_ADMIN_EMAIL:', import.meta.env.VITE_ADMIN_EMAIL);

  // Verify that customerEmail exists and is not the admin email
  if (!isAdminCopy && (!booking.customerEmail || booking.customerEmail === import.meta.env.VITE_ADMIN_EMAIL)) {
    console.error('❌ CUSTOMER EMAIL IS MISSING OR SAME AS ADMIN!', booking.customerEmail);
  }

  const templateParams = {
    to_email: recipientEmail,
    customer_name: booking.customerName,
    receipt_code: booking.receiptCode,
    service: booking.service,
    date: booking.date,
    time: booking.timeSlot,
    status: booking.status,
    phone: booking.customerPhone,
  };

  console.log('Template params:', templateParams);

  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log(`✅ Email sent successfully to ${recipientEmail}`, result);
    return true;
  } catch (error) {
    console.error(`❌ EmailJS error for ${recipientEmail}:`, error);
    return false;
  }
};