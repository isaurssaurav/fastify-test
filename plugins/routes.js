function routes(fastify, options, done) {
  // variable for storing reference to the mongodb collection.
  const todoCollection = fastify.mongo.db.collection("todo");
  const getAllOpts = {
    schema: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
  };

  const getOpts = {
    schema: {
      200: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          status: { type: "string" },
          created_at: { type: "string" },
          updated_at: { type: "string" },
        },
      },
    },
  };
  const postOpts = {
    schema: {
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          status: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
  };

  const putOpts = {
    schema: {
      body: {
        type: "object",
        properties: {
          id: { type: "string" },
          status: { type: "string" },
        },
      },
    },
  };

  const deleteOpts = {
    schema: {
      querystring: {
        id: { type: "string" },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
          },
        },
      },
    },
  };

  fastify.get("/", getAllOpts, async (request, reply) => {
    //MongoDB find() method
    return await todoCollection.find().toArray();
  });

  fastify.get("/:id", getOpts, async (request, reply) => {
    const { id } = request.params;
    const _id = fastify.mongo.ObjectId(id);
    return await todoCollection.find({ _id: _id }).toArray();
  });

  // Schema for inserting new item in the database.
  fastify.post("/", postOpts, async (request, r) => {
    const todo = request.body;
    console.log("-----");
    //Assigning the current date and time to the fields.
    todo.created_at = new Date();
    todo.updated_at = new Date();
    //Inserting the value into the database use MongoDB’s insertOne() function
    const response = await todoCollection.insertOne(todo);
    // console.log("****", response);
    // const insertedTodo = response.ops[0];
    return {
      ...todo,
      _id: response.insertedId,
    };
  });

  fastify.put("/", putOpts, async (request, reply) => {
    let { _id, status } = request.body;
    //Finding mongo object id from user-assigned id.
    _id = fastify.mongo.ObjectId(_id);
    //Using MongoDB’s findOneAndUpdate() function.
    const result = await todoCollection.findOneAndUpdate(
      { _id },
      { $set: { status, updated_at: new Date() } },
      { returnOriginal: false }
    );
    return result.value;
  });

  // Schema for deleting an existing item in the database.
  fastify.delete("/:id", deleteOpts, async (req, res) => {
    const { id } = req.params;
    const _id = fastify.mongo.ObjectId(id);
    try {
      //Using MongoDB’s deleteOne() function which requires an ObjectID
      const result = await todoCollection.deleteOne({ _id });
      console.log(result);
      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  });
  //Calling done() to resume fastify lifecycle.
  done();
}
//Exporting the routes functions for usage in index.js
module.exports = routes;
