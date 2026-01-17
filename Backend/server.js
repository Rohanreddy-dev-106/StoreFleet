import server from "./index.js";
import Connection from "./src/config/mongoos.config.js";
const PORT = process.env.PORT
server.listen(PORT, () => {
    Connection()
    console.log(`Server is Up and Running at PORT ${PORT}`);

})