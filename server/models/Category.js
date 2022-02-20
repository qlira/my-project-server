const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            trim:true,
            required: true,
            maxlength:32
        }  
    },
    {timestamps:true}
);

module.exports = User = mongoose.model("Category", categorySchema);