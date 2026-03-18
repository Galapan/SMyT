const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter optimized for Vercel/Serverless
// Initialize Nodemailer transporter optimized for Vercel/Serverless
// Se fuerza el uso del puerto 587 con STARTTLS para evitar complicaciones en Vercel
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false, // false for port 587 (uses STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Better compatibility with some SMTP providers
  },
  logger: process.env.NODE_ENV !== 'production', // Keep minimal logging if not in production
  debug: false, // Turned off to prevent excessive console spam during startup
  // Important for serverless: don't keep connections open
  pool: false,
  maxConnections: 1,
  maxMessages: 1
});

// Verify transporter configuration on startup (non-blocking)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Transport verification failed:', error.message);
    console.error('Check your SMTP credentials in .env file');
    console.error('For Vercel, ensure you are using port 587 and an App Password (for Gmail)');
  } else {
    console.log('✅ SMTP Transport ready to send emails');
  }
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
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #572671; font-size: 20px; font-weight: 600; margin: 15px 0 5px 0;">Control de Inventarios</h1>
            <h2 style="color: #572671; font-size: 20px; font-weight: 700; margin: 0;">SMyT</h2>
          </div>
          
          <div style="background-color: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px;">
            <h3 style="color: #333; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Verifica tu cuenta</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">Usa el siguiente código de 6 dígitos para verificar tu cuenta.</p>
            
            <div style="background-color: #fdfdfd; border: 2px dashed #e0e0e0; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #572671;">${codigo}</span>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 15px;">Este código expirará en 24 horas.</p>
          </div>
          
          <div style="text-align: center;">
            <p style="color: #bbb; font-size: 11px; margin: 0;">© 2026 Gobierno del Estado de Tlaxcala</p>
          </div>
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
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #572671; font-size: 20px; font-weight: 600; margin: 15px 0 5px 0;">Control de Inventarios</h1>
            <h2 style="color: #572671; font-size: 20px; font-weight: 700; margin: 0;">SMyT</h2>
          </div>
          
          <div style="background-color: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px;">
            <h3 style="color: #333; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Recuperación de Contraseña</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">Usa el siguiente código de 6 dígitos para restablecer tu contraseña.</p>
            
            <div style="background-color: #fdfdfd; border: 2px dashed #e0e0e0; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #572671;">${codigo}</span>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 15px; line-height: 1.4;">Este código expirará en 1 hora.<br>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          </div>
          
          <div style="text-align: center;">
            <p style="color: #bbb; font-size: 11px; margin: 0;">© 2026 Gobierno del Estado de Tlaxcala</p>
          </div>
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
    const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://smyt-project.vercel.app';
    const confirmUrl = `${frontendUrl}/security?action=confirm&token=${token}`;
    const rejectUrl = `${frontendUrl}/security?action=reject&token=${token}`;

    const mailOptions = {
      from: `"SMyT Seguridad" <${process.env.SMTP_USER || 'noreply@smyt.com'}>`,
      to: email,
      subject: 'Alerta de Seguridad: Cambio de Contraseña - SMyT',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://smyt-project.vercel.app/LogoTlax.png" alt="Logo Tlaxcala" style="width: 100px; height: auto;" />
            <h1 style="color: #572671; font-size: 20px; font-weight: 600; margin: 15px 0 5px 0;">Control de Inventarios</h1>
            <h2 style="color: #572671; font-size: 20px; font-weight: 700; margin: 0;">SMyT</h2>
          </div>
          
          <div style="background-color: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px;">
            <h3 style="color: #333; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Aviso de Cambio de Contraseña</h3>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">Hola, recientemente se cambió la contraseña de tu cuenta en el sistema SMyT. Si fuiste tú, por favor confirma el cambio.</p>
            
            <a href="${confirmUrl}" style="display: inline-block; background-color: #572671; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(87, 38, 113, 0.2);">Sí, fui yo</a>
            
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 0 0 25px 0;" />
            
            <h4 style="color: #d9534f; font-size: 14px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">¿No fuiste tú?</h4>
            <p style="color: #666; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">Si no solicitaste este cambio, alguien más tiene acceso a tu cuenta. Desactívala de inmediato.</p>
            
            <a href="${rejectUrl}" style="display: inline-block; background-color: #ffffff; border: 1px solid #d9534f; color: #d9534f; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px;">No fui yo, proteger mi cuenta</a>
            
            <p style="color: #999; font-size: 11px; margin-top: 30px; margin-bottom: 0;">Estos enlaces expirarán en 24 horas.</p>
          </div>
          
          <div style="text-align: center;">
            <p style="color: #bbb; font-size: 11px; margin: 0;">© 2026 Gobierno del Estado de Tlaxcala</p>
          </div>
        </div>
      `,
    };

    console.log(`📧 Attempting to send security alert email to: ${email}`);
    
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Security alert email sent successfully:', info.messageId);
    console.log('📨 Accepted recipients:', info.accepted);
    return true;
  } catch (err) {
    console.error('❌ Error sending security alert email:', err.message);
    console.error('🔍 Full error details:', {
      name: err.name,
      code: err.code,
      command: err.command,
      response: err.response
    });
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail
};
