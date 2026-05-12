const mongose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();
mongose.connect(process.env.db_uri).then(
  () => {
    console.log("Connected Succ to Db");
  },
  () => {
    console.log("Erro on connecting");
  },
);

app.listen(process.env.port || 3000, () => {
  console.log("Server Is Run");
});
