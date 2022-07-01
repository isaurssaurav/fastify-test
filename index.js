// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
// Import the plugin files.
fastify.register(require("./plugins/mongo"));
// Defining the prefix for navigation in the URL.
fastify.register(require("./plugins/routes"), { prefix: "/todo" });
// Creating server call
const start = async () => {
  try {
    await fastify.listen(3000); // Requesting access to port 3000
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
  }
};
// Calling the start function
start();
