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

/**
 * Sends a security alert email when a password is changed, with links to confirm or reject the change.
 * @param {string} email - The user's email address.
 * @param {string} token - The signed JWT token containing the user's ID and action.
 */
const sendSecurityAlertEmail = async (email, token) => {
  try {
    const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    const confirmUrl = `${frontendUrl}/security?action=confirm&token=${token}`;
    const rejectUrl = `${frontendUrl}/security?action=reject&token=${token}`;

    const info = await transporter.sendMail({
      from: `"SMyT Seguridad" <${process.env.SMTP_USER || 'noreply@smyt.com'}>`, // sender address
      to: email,
      subject: 'Alerta de Seguridad: Cambio de Contraseña - SMyT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Aviso de Cambio de Contraseña</h2>
          <p style="color: #555; text-align: center;">Hola, recientemente se cambió la contraseña de tu cuenta en el sistema SMyT.</p>
          <p style="color: #555; text-align: center;">Si fuiste tú, por favor confirma el cambio haciendo clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${confirmUrl}" style="background-color: #572671; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Sí, fui yo</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #d9534f; text-align: center; font-weight: bold;">¿No fuiste tú?</p>
          <p style="color: #555; text-align: center;">Si no solicitaste este cambio, ALGUIEN MÁS TIENE ACCESO A TU CUENTA. Haz clic en el botón de abajo para <strong>desactivar tu cuenta inmediatamente</strong> y proteger tu información.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${rejectUrl}" style="background-color: #d9534f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">No fui yo, proteger mi cuenta</a>
          </div>
          <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">Estos enlaces expirarán en 24 horas.</p>
        </div>
      `,
    });

    console.log('Security alert email sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending security alert email:', err);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail
};
