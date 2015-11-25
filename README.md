# hermes
Messages server

[![Build Status](https://secure.travis-ci.org/algomonster/hermes.png)](http://travis-ci.org/algomonster/hermes)
[![Coverage Status](https://coveralls.io/repos/algomonster/hermes/badge.svg?branch=master&service=github)](https://coveralls.io/github/algomonster/hermes?branch=master)

## Command line examples

Run server using default settings:
```
node ./bin/www
```

Run server via PM2:
```
pm2 start ./bin/www --name "hermes"
```

### Run tests

```
npm test
```

### Run coverage analyse
```
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec
```
