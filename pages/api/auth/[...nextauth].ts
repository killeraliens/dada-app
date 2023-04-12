import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiHandler } from "next";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;

const options: AuthOptions = {
  providers: [],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    signIn: async (user, account, profile) => {
      if (account.provider === 'email') {
        const email = account.email;
        const password = account.password;
        // validate email and password here using your preferred method
        // and return user object or false if validation fails
        const isValid = await validateUser(email, password);
        if (isValid) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(false);
        }
      }
    }
  }
};

async function validateUser(email: string, password: string): Promise<boolean> {
  // perform validation logic here, e.g. query the database for the user's credentials
  // and return true if they match or false if they don't
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return false;
  }
  const isValidPassword = true;
  return isValidPassword;
}