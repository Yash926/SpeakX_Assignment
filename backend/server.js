const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

// Manual env loading
const loadEnv = () => {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n').reduce((acc, line) => {
      const [key, value] = line.split('=');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
    
    process.env = { ...process.env, ...envVars };
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
};

loadEnv();

// Verify environment variables
const MONGODB_URI = "mongodb+srv://tripathiyash143:tripathi143@cluster0.idiz2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 50051;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Load proto file
const packageDefinition = protoLoader.loadSync('./proto/questions.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

// MongoDB connection
const mongoClient = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// gRPC service implementation
const server = new grpc.Server();

server.addService(questionsProto.QuestionService.service, {
  getQuestions: async (call, callback) => {
    try {
      console.log('Received request:', call.request);
      
      await mongoClient.connect();
      const db = mongoClient.db('SpeakX_DB');
      const collection = db.collection('Questions');

      const { page = 1, pageSize = 10, search = '', filters = {} } = call.request;

      // Build query
      const query = {};
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      if (filters.types && filters.types.length > 0) {
        query.type = { $in: filters.types };
      }

      console.log('MongoDB query:', query);

      const questions = await collection
        .find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      console.log('Found questions:', questions);

      const total = await collection.countDocuments(query);
      
      const response = {
        questions,
        total,
        page,
        totalPages: Math.ceil(total / pageSize)
      };

      console.log('Sending response:', response);
      
      callback(null, response);
    } catch (error) {
      console.error('MongoDB Error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: error.message
      });
    }
  }
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start server:', error);
      return;
    }
    console.log(`Server running at http://0.0.0.0:${port}`);
    server.start();
  }
);

// Handle process termination
process.on('SIGINT', async () => {
  await mongoClient.close();
  process.exit(0);
});