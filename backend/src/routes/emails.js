import { emailRepository } from "../repositories/email.repository.js";
import z from 'zod'

// This can be shared given that is a monorepo
const schema = z.object({
  to: z.email(),
  cc: z.union([z.literal(""), z.email(), z.null()]),
  bcc: z.union([z.literal(""), z.email(), z.null()]),
  subject: z.string().min(2).max(100),
  body: z.string().min(10).max(1000),
});

const plugin = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const result = await emailRepository.findAll();
    reply.send(result);
  });

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    const result = await emailRepository.findById(id);
    reply.send(result);
  });

  fastify.post("/", async (request, reply) => {
    const emailData = request.body;

    const parseResult = schema.safeParse(emailData);
    if (!parseResult.success) {
      return reply.status(400).send({ error: z.treeifyError(parseResult.error) });
    }

    const [email] = await emailRepository.create(emailData);
    reply.status(201).send(email);
  });
};

export default plugin;
