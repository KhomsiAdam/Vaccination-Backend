// Nodemailer
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const mail = {
  name: 'Vaccination Manager',
  link: 'link',
  intro: 'Thank you for your participation.',
  // instructions: 'instructions',
  color: '#22BC66',
  text: 'text',
  outro: 'Thank you for trusting us.',
  subject: 'Vaccination appointment',
};

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: mail.name,
    link: mail.link,
  },
});

const generatedEmail = (data) => {
  const content = {
    body: {
      intro: mail.intro,
      action: {
        instructions: `Your appointment is planned at: ${data.appointment}`,
        button: {
          color: mail.color,
          text: mail.text,
          link: mail.link,
        },
      },
      outro: mail.outro,
    },
  };
  return content;
};

const sendMail = async (data) => {
  const emailBody = mailGenerator.generate(generatedEmail(data));
  const emailText = mailGenerator.generatePlaintext(generatedEmail(data));

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"${mail.name}" <${testAccount.user}>`,
    to: data.email,
    subject: mail.subject,
    text: emailText,
    html: emailBody,
  });

  // __log.debug(`Message sent: ${info.messageId}`);
  __log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

module.exports = { sendMail };
