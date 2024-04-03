import mongoose from 'mongoose';

const connect = () => {
    return mongoose.connect("mongodb+srv://giselabelenortiz:3pPbZG0naeHtWTVA@cluster0.ab5jnzr.mongodb.net/")
    .then(() => {
        console.log('Base de datos conectada');
    })
    .catch((err) => {
        console.error('Error al conectar con la base de datos:', err);
    });
};

export default  {connect};

