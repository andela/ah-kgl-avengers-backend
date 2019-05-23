# Authors' Haven

[![Build Status](https://travis-ci.com/andela/ah-kgl-avengers-backend.svg?branch=develop)](https://travis-ci.com/andela/ah-kgl-avengers-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/ah-kgl-avengers-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/ah-kgl-avengers-backend?branch=develop&kill_cache=1)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

 A blogging platform for the creative at heart.
> Authors' Haven is a simple API that allows users to write, read and share.
> Our vision is to create a community of like minded authors to foster inspiration and innovation by leveraging the modern web.

## Documentation
Comprehensive documentation for the API is hosted [here](https://ah-kg-avengers-backend-staging.herokuapp.com/swagger).

## Features
- Users can create accounts to store their data.
- Users can create, edit and delete articles.
- Users can read other authors' articles.
- Users can follow other authors and share these articles on Social Platforms.

## Tools
Tools used for development of this API are;
- Documentation : [Swagger](https://swagger.io/)
- Database: [PostgreSQL](https://www.postgresql.org)
- Framework: [ExpressJS](http://expressjs.com/)
- Code Editor/IDE: [VSCode](https://code.visualstudio.com)
- Programming language: [JavaScript(ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- API Testing environment: [Postman](https://www.getpostman.com)


## Getting Started
1. After cloning the repository from [here](https://github.com/andela/ah-kgl-avengers-backend), install requirements by running this command in the root of the repo folder
```sh
    $ npm install
```

2. Create a PostgreSQL database and take note of the database configurations.

3. Make a copy of `.env.sample` and rename it to `.env`. Edit the file replacing the respective configuration values.

4. Run the following commands in the projects root to set up migrations and to seed the database 
```sh 
    $ npm run migrate
    $ npm run seed
 ```
5. Run the following command to start the API server:
```sh
    $ npm start
```

## Running the tests

To run tests, use the following commands in your terminal to apply migrations, seed the database and then run tests
```sh
   NODE_ENV=test && npm run migrate
   npm run seed
   npm test 
 ``` 

## Contributors
Many thanks to `Alpha Ogilo` and `Bridget Mendoza`.

### Key Contributors
- Eric Shema
- Jean Bosco Niyodusenga
- Fridolin Niyonsaba
- Aaron Sekisambu
- Vincent De Paul Abimana