const express = require("express");
const routes=require("./routes");
const index=require("./config");

// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
// });

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(routes);


app.listen(5000, () => console.log("Server is up at 5000"));



















