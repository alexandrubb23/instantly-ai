// ESM
import Fastify from 'fastify';
import routes from './src/routes/index.js';
import emails from './src/routes/emails.js';

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true
});

fastify.register(routes);
fastify.register(emails, { prefix: '/emails' });

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
