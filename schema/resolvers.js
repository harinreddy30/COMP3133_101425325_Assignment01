const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const SECRET_KEY = process.env.JWT_SECRET


const resolvers = {
    Query: {
      login: async (_, { username, email, password }) => {
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) throw new Error("User not found");
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");
  
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
        return { token, user };
      },
  
      getAllEmployees: async (_, __, { req }) => {
        auth(req);
        return await Employee.find();
      }, 
  
      getEmployeeById: async (_, { eid }, { req }) => {
        auth(req);
        const employee = await Employee.findById(eid);
        if (!employee) throw new Error("Employee not found");
        return employee;
      },
  
      searchEmployeeDesignOrDept: async (_, { designation, department }, { req }) => {
        auth(req);
        const query = {};
        if (designation) query.designation = designation;
        if (department) query.department = department;
  
        return await Employee.find(query);
      },
    },
  
    Mutation: {
      signup: async (_, { username, email, password }) => {
        const user = new User({ username, email, password });
        await user.save();
  
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
        return { token, user };
      },
  
      addEmployee: async (_, args, { req }) => {
        auth(req);
        const employee = new Employee(args);
        await employee.save();
        return employee;
      },
  
      updateEmployee: async (_, { eid, ...updates }, { req }) => {
        auth(req);
        const employee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
        if (!employee) throw new Error("Employee not found");
        return employee;
      },
  
      deleteEmployee: async (_, { eid }, { req }) => {
        auth(req);
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) throw new Error("Employee not found");
        return "Employee deleted successfully";
      },
    },
  };
  
  module.exports = resolvers;