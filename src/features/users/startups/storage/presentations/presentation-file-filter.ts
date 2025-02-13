import { BadRequestException } from "@nestjs/common";

export const presentationFileFilter = (req, file, callback) => {
    const allowedMimeTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type. Allowed: PDF, PPTX'), false);
    }
    callback(null, true);
};