import multer from "multer";
import path from "path"

const uploadDirectory = process.env.VERCEL
   ? "/tmp"
   : path.join(process.cwd(), "public", "temp")

const storage = multer.diskStorage({

   destination:function(req,file,cb){
      cb(null,uploadDirectory)
   },
   filename:function(req,file,cb){
      cb(null,file.originalname)
   }
})

export const upload = multer({ storage })
