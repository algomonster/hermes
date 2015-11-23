# hermes
Messages server

[![Build Status](https://secure.travis-ci.org/algomonster/hermes.png)](http://travis-ci.org/algomonster/hermes)

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

Install mocha
```
sudo npm install -g mocha
```

mocha tests/mocha tests
