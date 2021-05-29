# Simple Node.js Authentication API
API for Authentication & CRUD

[![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)


[Installation](#installation) |
[Notes](#notes) |
[License](#licenses)

## Installation

### Prerequisites
- Node.js - Download and Install [Node.js](https://nodejs.org/en/) with [NVM](https://github.com/creationix/nvm) (Node Version Manager) - Simple bash script to manage multiple active node.js versions.
- MySQL - Download and Install [MySQL](https://www.mysql.com/downloads/) - Make sure it's running on port 3306
- Redis - Download and Install [Redis](http://redis.io/download) - Make sure it's running on port 6379

IF you have Docker Container just simply:
```
  $ git clone https://github.com/dhanibaharzah/nodejs-auth-jwt-crud.git
  $ cd nodejs-auth-jwt-crud
  $ cp .env.sample .env
  $ bash start.sh
```

IF you only have a NATIVE node.js just simply
```
  $ git clone https://github.com/dhanibaharzah/nodejs-auth-jwt-crud.git
  $ cd nodejs-auth-jwt-crud
  $ cp .env.sample .env
  $ npm install
  $ npm start
```

We use Git `pre-commit` hook

Current tools we using is [`pre-commit`](https://github.com/observing/pre-commit), Overcommit is a Git hook manager that includes support for running standard as a Git pre-commit hook. To enable this, add the following to your `package.json` file:

```
pre-commit: [
  'standard',
  'test'
]
```

### Notes
------------
* This is using Fastify framework, which is only one different with expressJS? You Need create scheme any data send or return
* You can use this for callback endpoint or every request to API partners

### License
----

[Beerware](https://en.wikipedia.org/wiki/Beerware "Beerware") © [orbitcreation.com]
