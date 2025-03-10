import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req: any,res: any)=>{

     res.status(500).json({
         message: "Welcome to Register module"
     });
});

export {
     registerUser,
}