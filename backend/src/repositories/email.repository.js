import { knex } from "../db/index.js";

export const emailRepository = {
  findAll: () => knex("emails").select("*").orderBy("created_at", "desc"),
  findById: (id) => knex("emails").select("*").where({ id }).first(),
  create: (emailData) => knex("emails").insert(emailData).returning(["id", "to", "subject", "body", "created_at"])
};