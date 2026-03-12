const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a verification email to the user with a 6-digit code.
 * @param {string} email - The user's email address.
 * @param {string} codigo - The 6-digit verification code.
 */
const sendVerificationEmail = async (email, codigo) => {
  try {
    const info = await transporter.sendMail({
      from: `"SMyT" <${process.env.SMTP_USER || 'noreply@smyt.com'}>`, // sender address
      to: email,
      subject: 'Código de Verificación - SMyT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Verifica tu cuenta</h2>
          <p style="color: #555; text-align: center;">Usa el siguiente código de 6 dígitos para verificar tu cuenta en el sistema SMyT.</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0056b3;">${codigo}</span>
          </div>
          <p style="color: #777; font-size: 12px; text-align: center;">Este código expirará en 24 horas.</p>
        </div>
      `,
    });

    console.log('Verification email sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending verification email:', err);
    return false;
  }
};

/**
 * Sends a password reset email sequentially to the user with a 6-digit code.
 * @param {string} email - The user's email address.
 * @param {string} codigo - The 6-digit verification code.
 */
const sendPasswordResetEmail = async (email, codigo) => {
  try {
    const info = await transporter.sendMail({
      from: `"SMyT" <${process.env.SMTP_USER || 'noreply@smyt.com'}>`, // sender address
      to: email,
      subject: 'Recuperación de Contraseña - SMyT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
          <p style="color: #555; text-align: center;">Usa el siguiente código de 6 dígitos para restablecer tu contraseña en el sistema SMyT.</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #572671;">${codigo}</span>
          </div>
          <p style="color: #777; font-size: 12px; text-align: center;">Este código expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
    });

    console.log('Password reset email sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
