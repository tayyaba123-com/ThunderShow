import  dotenv from "dotenv";
dotenv.config();
import app from './src/app.js';
import connectoDB from './src/config/database.js'

connectoDB()



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})