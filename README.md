# Development

### Install dependencies
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:6.7.0 npm install

### Run unit-tests
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:6.7.0 npm test

### Start application
docker-compose up
