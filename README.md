# Game Release Date App (In Development)

A web app for searching basic video game info and release dates from [GiantBomb.com's API](https://www.giantbomb.com/api/).

The project utilizes JavaScript, HTML, CSS, React.js, Next.js, Node.js, Express.js, and Axios.js.

The project was bootstrapped with [Next.js](https://nextjs.org/)

## Required Software

Node.js: https://nodejs.org/en/

## Initial Setup

1. Get a free API key from GiantBomb.com: https://www.giantbomb.com/api/
2. Add your key to ./src/myKey.json
```
{
    "apiKey": "Your Key Here"
}
```
Note: The API key is only loaded by the Express Node server, so it should not be bundled into client pages by Webpack.
3. Run npm install in the app directory to set up node modules list in package.json
```
cd <app directory>
npm install
```

## Available Scripts

In the app directory, you can run:

### `npm run dev`

Runs the app in development mode with hot code reloading.<br>
View the site by visiting [http://localhost:3000](http://localhost:3000).

See the Next.js [Setup](https://nextjs.org/docs#setup) documentation to learn more.

### `npm run build`

Builds the app for production.

See the Next.js [Production deployment](https://nextjs.org/docs#production-deployment) documentation to learn more.

### `npm start`

Start the production build server.

See the Next.js [Production deployment](https://nextjs.org/docs#production-deployment) documentation to learn more.

## Author
Samy Masadi - https://github.com/SamyMasadi