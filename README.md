<div align="center">
	<h1>Facesign SDK for Node JS</h1>
	<p>
		<b>A simple and easy to use client for the <a href="https://docs.facesign.ai">Facesign API</a></b>
	</p>
	<br>
</div>

## Installation

```
npm install @facesign/api
yarn add @facesign/api
```

## Usage

Import and initialize a client using an **integration token**

```js
const { Client } = require('@facesignai/api')

// Initializing a client
const facesignClient = new Client({
  auth: process.env.FACESIGN_TOKEN,
})
```

Make a request to any Facesign API endpoint.
