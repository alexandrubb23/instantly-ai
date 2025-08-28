const aiRoutes = async (fastify) => {
  fastify.post('/draft', async (request, reply) => {
    const draftData = request.body;
    console.log("Creating draft:", draftData);
  });
}

export default aiRoutes;