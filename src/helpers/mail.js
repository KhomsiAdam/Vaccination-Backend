// Nodemailer
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const mail = {
  name: 'name',
  link: 'link',
  intro: 'intro',
  instructions: 'instructions',
  color: '#22BC66',
  text: 'text',
  outro: 'outro',
  subject: 'subject',
};

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: mail.name,
    link: mail.link,
  },
});

const generatedEmail = () => {
  const content = {
    body: {
      intro: mail.intro,
      action: {
        instructions: mail.instructions,
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

const sendMail = async (email, type) => {
  const emailBody = mailGenerator.generate(generatedEmail(email));
  const emailText = mailGenerator.generatePlaintext(generatedEmail(email));

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
    to: email,
    subject: mail.subject,
    text: emailText,
    html: emailBody,
  });

  // __log.debug(`Message sent: ${info.messageId}`);
  __log.debug(`Emails for delivery trucks of type "${type}" sent.`);
  __log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

module.exports = sendMail;
