export const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new Error('Invalid file type'), false);
    }
    callback(null, true);
};