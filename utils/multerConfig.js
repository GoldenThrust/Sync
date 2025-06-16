import multer from 'multer';
import "dotenv/config";

const upload = multer({ dest: './uploads' });

export default upload;
