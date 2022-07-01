// Require the fastify-plugin plugin and instantiate it
const fastifyPlugin = require("fastify-plugin");
// Creating a function for establishing mongodb connection
function dbConnector(fastify, options, done) {
  fastify.register(require("fastify-mongodb"), {
    // mongodb local connection at default port–27017 and selected db
    url: "mongodb://localhost:27017/todo_test_app",
  });
  done();
}
//exporting the function for later usage in other files.
module.exports = fastifyPlugin(dbConnector);
