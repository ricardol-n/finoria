const mongoose = require("mongoose");

const LoginActivitySchema = new mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  ip:{
    type:String
  },

  device:{
    type:String
  },

  browser:{
    type:String
  },

  location:{
    type:String
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("LoginActivity",LoginActivitySchema);