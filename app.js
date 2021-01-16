const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = require('./routes/');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'client/build')));

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});