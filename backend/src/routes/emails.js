import { knex } from "../db/index.js";

const plugin = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const result = await knex("emails").select("*");
    reply.send(result);
  });

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    const result = await knex("emails").select("*").where({ id }).first();
    reply.send(result);
  });

  fastify.post("/", async (request, reply) => {
    const emailData = request.body;

    const [id] = await knex("emails").insert(emailData).returning("id");
    reply.status(201).send({ id });
  });
};

export default plugin;
