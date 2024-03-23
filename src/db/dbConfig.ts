import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection
        connection.on("connected",()=>{
            console.log("db connected successfully");
            
        })
        connection.on("dbconncetion error",(error)=>{
            console.log("check if the db is up and runnig "+ error);
            process.exit();
            
        })
        
    } catch (error) {
        console.log("connection to db failed ");
        console.log(error);
        
        
    }

}