import server from "./index.js";
const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is Up and Running at PORT ${PORT}`);

})