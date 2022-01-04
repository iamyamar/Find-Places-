const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const PORT = process.env.Port || 5000;



app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
