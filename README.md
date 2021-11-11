# Tool to process csv files

## Build and run app with docker

need install docker and docker-compose

Build the image
```sh
docker build -t challenge .
```

For start the app
```sh
docker-compose up -d
```

open browser in: http://localhost:4000  
and test upload file test.csv


For stop the app
```sh
docker-compose down
```

## run test
install dependencies
```sh
yarn
```

run unit test
```sh
yarn run test
```

## Global Dev dependencies for dev mode

```sh
nodejs 12.13.0
npm install -g yarn
```

## Dev mode

install dependencies backend
```sh
yarn
```

run backend
```sh
yarn run dev
```

go to folder react-app
```sh
cd react-app
```

install dependencies frontend
```sh
yarn
```

run backend
```sh
yarn start
```
