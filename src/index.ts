import 'reflect-metadata';
import { startServer } from './app';
import { connectToDB } from './data-source';

const startApp = async () => {
  await connectToDB();
  await startServer();
};

startApp();
