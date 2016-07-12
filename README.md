# Elsendes
Messages server

[![Build Status](https://secure.travis-ci.org/resnext/elsendes.png)](http://travis-ci.org/resnext/elsendes)
[![Coverage Status](https://coveralls.io/repos/resnext/elsendes/badge.svg?branch=master&service=github)](https://coveralls.io/github/resnext/elsendes?branch=master)

## Setup

```sh
git clone https://github.com/resnext/elsendes.git
cd elsendes
npm install
```

### Run tests

```sh
npm test
```

### Run with command line

```sh
node ./bin/www
```

## Run server via PM2:

For run this service via PM2 application manager you should got to directory when *elsendes* installed and run that:

```sh
pm2 start ./bin/www --name "elsendes"
```

For start on the production environment use:

```sh
```

## Contributing

Are you welcome!

### Run coverage analyse

```sh
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec
```
