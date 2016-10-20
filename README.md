[![Coverage Status](https://coveralls.io/repos/github/danieleorler/arduino_thermometer_ws/badge.svg?branch=master)](https://coveralls.io/github/danieleorler/arduino_thermometer_ws?branch=master)

# Development

### Install dependencies
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:6.7.0 npm install

### Run unit-tests
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:6.7.0 npm test

### Start application
docker-compose up
