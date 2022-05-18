import 'reflect-metadata';
import { starServer } from './app';
import { connectToDB } from './data-source';

const startApp = async () => {
  await connectToDB();
  starServer();
};

startApp();
