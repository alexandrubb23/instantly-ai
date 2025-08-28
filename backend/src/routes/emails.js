
const plugin = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    console.log("Fetching emails...");
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    console.log(`Fetching email with ID: ${id}`);
  });

  fastify.post('/', async (request, reply) => {
    const emailData = request.body;
    console.log("Creating email:", emailData);
  });
};

export default plugin;
