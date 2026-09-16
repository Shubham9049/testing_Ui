import app from "./app.js";
import "dotenv/config";
import connection from "./config/db.js";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const PORT = process.env.PORT || 5000;
connection();
app.listen(PORT, () => {
  console.log(`server is listen on port ${PORT}`);
});
