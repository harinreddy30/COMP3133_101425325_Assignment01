const mongoose = require('mongoose')
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: { 
        type: String, unique: true, required: true, 
        validate: [validator.isEmail, "Invalid email format"]
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true, min: 1000 },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true },
    employee_photo: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Employee", EmployeeSchema);
