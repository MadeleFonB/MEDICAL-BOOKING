const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const mongoose = require('mongoose'); 
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/resolvers/resolvers');

async function startServer() {
  const app = express();

  // Conectar a MongoDB
  try {
    await mongoose.connect('mongodb://localhost:27017/clinic', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
  app.use(express.static(path.join(__dirname, 'public')));

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  const PORT = 5050;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`🖥️  Frontend servido en http://localhost:${PORT}/index.html`);
  });
}

startServer();
