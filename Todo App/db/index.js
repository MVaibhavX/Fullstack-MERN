const mongoose = require("mongoose");

//schema
const todoSchema = mongoose.Schema({
    title : String,
    timing : String
})



//models
const Todo = mongoose.model(Todo, todoSchema);

//mongoose connection
const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    return;
}


// exports
module.exports = {
    Todo, 
    connectDb
}