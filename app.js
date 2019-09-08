const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


let port = process.env.port || 3000;
app.listen(port, () => {
	console.log("Started the blog app server");
})

