import knexFactory from "knex";

export const knex = knexFactory({
  client: "sqlite3",
  connection: {
    filename: "./dev.sqlite3",
  },
});
