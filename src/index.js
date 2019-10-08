const express = require("express");
const morgan = require('morgan')
//initializations

const app = express();

app.set("port", process.env.PORT || 4000);

//middlewares

app.use(morgan('dev'));

// global variables


//routes
app.use(require('./routes/'))

// public


// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

