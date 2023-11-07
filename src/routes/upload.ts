import { FastifyInstance } from "fastify";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export default async function UploadRoute(fastify: FastifyInstance) {
  fastify.post(
    "/upload",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      const data = await request.file();

      if (!data) return reply.status(400).send({ message: "File is required" });

      await pump(
        data?.file,
        fs.createWriteStream(`./public/images/${data?.filename}`)
      );

      return reply.status(200).send({ message: "File uploaded" });
    }
  );
  fastify.post(
    "/upload-slips",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      const data = await request.file();

      if (!data) return reply.status(400).send({ message: "File is required" });

      await pump(
        data?.file,
        fs.createWriteStream(
          `./public/slips/${Date.now() + "-" + data?.filename}`
        )
      );

      return reply.status(200).send({ message: "File uploaded" });
    }
  );
}
