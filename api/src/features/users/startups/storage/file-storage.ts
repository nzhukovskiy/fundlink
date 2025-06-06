import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

export const fileStorage = (destination: string) => diskStorage({
    destination: `./uploads/${destination}`,
    filename: (req, file, callback) => {
        const uuid = uuidv4();
        const ext = file.originalname.split('.').pop();
        callback(null, `${file.fieldname}-${uuid}.${ext}`);
    },
});