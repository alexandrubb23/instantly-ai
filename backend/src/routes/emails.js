import { emailRepository } from "../repositories/email.repository.js";

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

    const email = await emailRepository.create(emailData);
    reply.status(201).send(email);
  });
};

export default plugin;
