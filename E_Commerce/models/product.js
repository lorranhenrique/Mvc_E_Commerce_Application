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
    },
    imgUrl: {
        type: String,
        required: true
    },
    descricao: { 
        type: String, 
        required: false,
        default: "" 
    },
    key: { 
        type: String, 
        required: false,
        default: "" 
    }
}, {timestamps: true});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;