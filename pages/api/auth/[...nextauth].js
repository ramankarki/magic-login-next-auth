import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';

import clientPromise from '../../../lib/mongodb';

console.log(process.env.EMAIL_SERVER_HOST);
console.log(process.env.EMAIL_SERVER_PORT);
console.log(process.env.EMAIL_SERVER_USER);
console.log(process.env.EMAIL_SERVER_PASSWORD);
console.log(process.env.NODE_ENV);
console.log(process.env.EMAIL_FROM);
console.log(process.env.NEXTAUTH_URL);
console.log(process.env.MONGODB_URI);
console.log(process.env.NEXTAUTH_SECRET);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const emailsDir = path.resolve(process.cwd(), 'emails');

const sendVerificationRequest = ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  });
  const emailTemplate = Handlebars.compile(emailFile);

  transporter
    .sendMail({
      from: `🪄 Login with Raman Magic NextAuth" ${process.env.EMAIL_FROM}`,
      to: identifier,
      subject: 'Your sign-in link for Login with Raman Magic NextAuth',
      html: emailTemplate({
        signin_url: url,
        email: identifier,
        base_url: process.env.NEXTAUTH_URL.replace('/api/auth', ''),
      }),
    })
    .catch((error) => console.log(error));
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `🪄 Login with Raman Magic NextAuth" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to Login with Raman Magic NextAuth! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL.replace('/api/auth', ''),
        support_email: 'onlinestationary0@gmail.com',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    EmailProvider({
      maxAge: 10 * 60, // Magic links are valid for 10 min only
      // sendVerificationRequest,
      from: process.env.EMAIL_FROM,
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  events: { createUser: sendWelcomeEmail },
});
