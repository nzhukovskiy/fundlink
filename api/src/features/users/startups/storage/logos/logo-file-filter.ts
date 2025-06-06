import { BadRequestException } from "@nestjs/common";

export const logoFileFilter =  (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
    callback(null, true);
};
