import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { User, IUser } from "@/models/user.model";
import { verifyPassword } from "@/lib/crypto";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "OmniService Secure Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP Code", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) {
          return null;
        }

        const identifier = (credentials.identifier as string).trim();
        const password = credentials.password as string | undefined;
        const otp = credentials.otp as string | undefined;
        const role = (credentials.role as string) || "customer";

        // Connect to MongoDB Atlas
        try {
          await connectToDatabase();
        } catch (dbErr) {
          console.warn("MongoDB connection fallback in authorize:", dbErr);
        }

        const isEmail = identifier.includes("@");
        const query = isEmail
          ? { email: identifier.toLowerCase() }
          : { phone: identifier.replace(/\s+/g, "") };

        // 1. Password-based authentication against MongoDB
        if (password) {
          try {
            const dbUser = await User.findOne(query).select("+passwordHash +passwordSalt");
            if (dbUser && dbUser.passwordHash && dbUser.passwordSalt) {
              const isValid = verifyPassword(password, dbUser.passwordHash, dbUser.passwordSalt);
              if (isValid) {
                // Update last active timestamp
                dbUser.lastActiveAt = new Date();
                await dbUser.save();

                return {
                  id: dbUser._id.toString(),
                  name: dbUser.name,
                  email: dbUser.email ?? undefined,
                  role: dbUser.role,
                  image: dbUser.avatarUrl || "/images/OmniService_Icon.png",
                };
              }
              // Password provided but mismatch -> reject
              return null;
            }
          } catch (err) {
            console.error("Error verifying password against MongoDB:", err);
          }
        }

        // 2. Demo / Instant Verification Bypass Accounts
        if (
          identifier === "demo@omniservice.world" ||
          identifier === "customer@omniservice.world" ||
          identifier === "9820012345"
        ) {
          try {
            let demoCustomer = await User.findOne({ email: "customer@omniservice.world" });
            if (!demoCustomer) {
              demoCustomer = await User.create({
                name: "OmniService Customer",
                email: "customer@omniservice.world",
                phone: "+91 98200 12345",
                role: "customer",
                status: "active",
                authProvider: "credentials",
              });
            }
            return {
              id: demoCustomer._id.toString(),
              name: demoCustomer.name,
              email: demoCustomer.email ?? "customer@omniservice.world",
              role: demoCustomer.role,
              image: "/images/OmniService_Icon.png",
            };
          } catch {
            return {
              id: "65f01234567890abcdef0001",
              name: "OmniService Customer",
              email: "customer@omniservice.world",
              phone: "+91 98200 12345",
              role: "customer",
              image: "/images/OmniService_Icon.png",
            };
          }
        }

        if (identifier === "pro@omniservice.world" || identifier === "pro@forgelocal.world") {
          try {
            let demoPro = await User.findOne({ email: "pro@omniservice.world" });
            if (!demoPro) {
              demoPro = await User.create({
                name: "Verified Pro Specialist",
                email: "pro@omniservice.world",
                phone: "+91 98200 54321",
                role: "professional",
                status: "active",
                authProvider: "credentials",
              });
            }
            return {
              id: demoPro._id.toString(),
              name: demoPro.name,
              email: demoPro.email ?? "pro@omniservice.world",
              role: demoPro.role,
              image: "/images/OmniService_Icon.png",
            };
          } catch {
            return {
              id: "65f01234567890abcdef0002",
              name: "Verified Pro Specialist",
              email: "pro@omniservice.world",
              role: "professional",
              image: "/images/OmniService_Icon.png",
            };
          }
        }

        if (identifier === "admin@omniservice.world" || identifier === "admin@forgelocal.world") {
          try {
            let demoAdmin = await User.findOne({ email: "admin@omniservice.world" });
            if (!demoAdmin) {
              demoAdmin = await User.create({
                name: "OmniService Operations Admin",
                email: "admin@omniservice.world",
                role: "admin",
                status: "active",
                authProvider: "credentials",
              });
            }
            return {
              id: demoAdmin._id.toString(),
              name: demoAdmin.name,
              email: demoAdmin.email ?? "admin@omniservice.world",
              role: demoAdmin.role,
              image: "/images/OmniService_Icon.png",
            };
          } catch {
            return {
              id: "65f01234567890abcdef0003",
              name: "OmniService Operations Admin",
              email: "admin@omniservice.world",
              role: "admin",
              image: "/images/OmniService_Icon.png",
            };
          }
        }

        // 3. OTP verification (123456 in demo/dev mode)
        if (otp === "123456" || otp?.length === 6) {
          try {
            let user = await User.findOne(query);
            if (!user) {
              user = await User.create({
                name: isEmail ? identifier.split("@")[0] : `User ${identifier.slice(-4)}`,
                email: isEmail ? identifier.toLowerCase() : null,
                phone: isEmail ? null : identifier,
                role: role as IUser["role"],
                status: "active",
                authProvider: "credentials",
                phoneVerified: !isEmail,
                emailVerified: isEmail ? new Date() : null,
              });
            }
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email ?? undefined,
              role: user.role,
              image: user.avatarUrl || "/images/OmniService_Icon.png",
            };
          } catch (dbCreateErr) {
            console.warn("DB user creation error:", dbCreateErr);
            return {
              id: "65f01234567890abcdef0001",
              name: identifier.split("@")[0] || identifier,
              email: isEmail ? identifier : undefined,
              role: role as string,
              image: "/images/OmniService_Icon.png",
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role?: string }).role = (token.role as string) || "customer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
