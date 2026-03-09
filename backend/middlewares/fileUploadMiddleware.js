import multer, { diskStorage } from "multer"
import path from "path"

const storage=diskStorage(({
	destination:(req,file,cb)=>{
		cb(null,"uploads/")
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now()+path.extname(file.originalname))
	}
}))
export const upload=multer({storage})