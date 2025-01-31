import {connect} from "@/db/dbConfig"
import { NextRequest,NextResponse } from "next/server"
import User from "@/models/user.model"
import bcryptjs from "bcryptjs"
import { sendMail } from "@/utils/mail.utils"

connect();

export async function POST(request:NextRequest){
try {
    const response = await request.json()
    const {username,email,password} = response;
    console.log(response);

    const user = await User.findOne({email})
    if(user){
        return NextResponse.json({error:"user already exist"},{status:400})
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password,salt)

    console.log(hashedPassword);
    
    
    const newUser  = new User({
        username,
        email,
       password: hashedPassword
    })

    const savedUser = await newUser.save()
    console.log(savedUser+"user saved successfully in database");

    //email verification process 

    console.log(savedUser._id);
    

    await sendMail({email,emailType:'VERIFY',userId:savedUser._id})
    return NextResponse.json({
        message:"user registered successfully",
        success:true,
        savedUser
    })


    


    
} catch (error:any) {
    return NextResponse.json({error:error.message},{
        status:500
    })
    
}
}
