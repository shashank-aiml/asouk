const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config()

require('./config/database');
require('./models/user');
require('./models/home');
require('./models/search');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin:'http://localhost:8080', credentials:true}));

app.use(require('./routes'));

app.get('/',(req, res) => {
    // let options = {
    //     domain: 'localhost',
    //     maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
    //     httpOnly: true, // The cookie only accessible by the web server
    //      // Indicates if the cookie should be signed
    // }
    // res.status(200).cookie('cookieName', 'cookieValue', options)
    //     .json({ success: true})
       
})
app.listen(PORT, function () {
    console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});