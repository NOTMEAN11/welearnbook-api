import { comparePassword, hashPassword } from "@/libs/hashPassword";
import {
  LoginType,
  RegisterType,
  RegisterSchema,
  LoginSchema,
} from "@/types/user";
import { FastifyInstance, FastifyRequest } from "fastify";

type DECODED = {
  id: string;
  iat: number;
  exp: number;
};

export default async function UserRoute(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Querystring: { all: boolean; skip: string; take: string };
      }>,
      reply
    ) => {
      try {
        const { all, skip, take } = request.query;
        const requser = request.user as DECODED;
        const users = await fastify.db.user.findUnique({
          where: {
            id: requser.id,
          },
          include: {
            Cart: true,
            Whishlist: true,
          },
        });

        if (!users) {
          return reply.status(404).send({ message: "User not found" });
        }

        if (all) {
          if (users.role !== "ADMIN") {
            return reply.status(401).send({ message: "Unauthorized" });
          }
          const allUsers = await fastify.db.user.findMany({
            skip: Number(skip) || 0,
            take: Number(take) || 10,
          });
          const total = await fastify.db.user.count();
          const result = {
            page: Math.floor(total / Number(take)) || 1,
            total,
            data: allUsers,
          };
          return reply.status(200).send(result);
        }

        const { password, ...user } = users;
        return reply.status(200).send(user);
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );

  fastify.post(
    "/login",
    async (request: FastifyRequest<{ Body: LoginType }>, reply) => {
      try {
        const { email, password } = request.body;
        await LoginSchema.parseAsync(request.body);

        const user = await fastify.db.user.findUnique({
          where: {
            email,
          },
        });

        if (user) {
          const isPasswordMatch = await comparePassword(
            password,
            user.password
          );

          if (!isPasswordMatch) {
            return reply.status(400).send({ message: "รหัสผ่านไม่ถูกต้อง" });
          }
          const token = fastify.jwt.sign({ id: user.id });
          return (
            reply
              // .setCookie("token", token, {
              //   path: "/",
              //   httpOnly: true,
              //   secure: true,
              //   expires: new Date(Date.now() + 60 * 60 * 1000),
              //   sameSite: "none",
              // })
              .send({ token: token })
          );
        }

        return reply.status(400).send({ message: "ไม่พบอีเมล์นี้" });
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );

  fastify.post(
    "/verify-token",
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply
    ) => {
      try {
        await request.jwtVerify();
        return reply.status(200).send({ message: "Token is valid" });
      } catch (error) {
        return reply.status(401).send({ message: "Token is invalid" });
      }
    }
  );

  fastify.post(
    "/register",
    async (request: FastifyRequest<{ Body: RegisterType }>, reply) => {
      await RegisterSchema.parseAsync(request.body);
      const { name, password, email, address, phone } = request.body;
      const hashedPassword = await hashPassword(password);
      try {
        const userExist = await fastify.db.user.findUnique({
          where: {
            email,
          },
        });

        if (userExist) {
          return reply.status(400).send({
            message: "มีอีเมล์หรือผู้ใช้งานนี้อยู่แล้วกรุณาลองอีกครั้ง",
          });
        }

        const user = await fastify.db.user.create({
          data: {
            name,
            email,
            address,
            phone,
            password: hashedPassword,
          },
        });

        return reply.status(201).send(user);
      } catch (error) {
        return reply.status(500).send({ message: error });
      }
    }
  );
}
