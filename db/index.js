import {Pool} from 'pg';
import ENV from 'dotenv';

ENV.config();

export default class Database {

  // Create database connection pool
  // and add it as a class variable
  constructor() {
    this.connectionString = process.env.DATABASE_URL;
    this.pool = new Pool({
      connectionString: this.connectionString,
    });

    //log connection success
    this.pool.on('connect',() => {
      console.log('client connected to the database');
    });

    //log connection error
    this.pool.on('error', (error) => {
      console.log(error);
    });

    // log pool disconnection
    this.pool.on('removed', () => console.log('client removed'));
  }

  // execute a query against the database
  async executeQuery(queryString, data) {
     return await this.pool.query(queryString, data);
  }
}
