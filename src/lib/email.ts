export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  // Email sending implementation placeholder
  console.log('Email would be sent to:', options.to);
  return Promise.resolve();
}
