const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const actores = require('./routes/actores')

// Inicializar servidor
const app = express(); 

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', actores)


// Establecer puerto
app.set('port', process.env.PORT || 5000);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

