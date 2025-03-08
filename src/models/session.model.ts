import mongoose,{Schema} from "mongoose";
import { User } from "./user.model.js";
import { timeStamp } from "console";

const sessionSchema = new Schema(
   {
      user_id :{
         type: Schema.Types.ObjectId,
         ref: User,
         required: true,
      },

      session_token : {
         type:String,
         required:true,
      },
      
      expireAt : {
        type: timeStamp,
        required: true,
      }

   },{
     timestamps: true,
   }
);

export const Session = mongoose.model("Session",sessionSchema);