const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    preco: {
        type: Number,
        required: true
    }
}, {timestamps: true});


const Product = mongoose.model('Product');
module.exports = Product;