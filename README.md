# Elsendes
Messages server

[![Build Status](https://secure.travis-ci.org/sashicorp/elsendes.png)](http://travis-ci.org/sashicorp/elsendes)
[![Coverage Status](https://coveralls.io/repos/sashicorp/elsendes/badge.svg?branch=master&service=github)](https://coveralls.io/github/sashicorp/elsendes?branch=master)

## Setup

``` sh
git clone https://github.com/sashicorp/elsendes.git
cd elsendes
npm install
```

## Command line examples

Run server using default settings:
```
node ./bin/www
```

Run server via PM2:
```
pm2 start ./bin/www --name "elsendes"
```

### Run tests

```
npm test
```

### Run coverage analyse
```
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec
```
