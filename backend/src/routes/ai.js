import { z } from "zod";
import { aiService } from "../services/ai.service.js";

const aiSchema = z.object({
  prompt: z.string().min(3),
  recipientBusiness: z.string().optional(),
});

const aiRoutes = async (fastify) => {
  fastify.post("/draft", async (req, reply) => {
    const parseResult = aiSchema.safeParse(req.body);
    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: z.treeifyError(parseResult.error) });
    }

    const { prompt, recipientBusiness } = req.body;

    try {
      // throw new Error("Error");
      
      await aiService.draftEmail(reply, prompt, recipientBusiness);
    } catch (error) {
      reply.status(500).send({ error: "Failed to draft email" });
    }
  });
};

export default aiRoutes;
