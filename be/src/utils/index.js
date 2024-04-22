const cloudinary = require('cloudinary').v2;

const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 2] + '/' + parts[parts.length - 1].split('.')[0];
}

const deleteImgCloud = async (data) => {
    const { file, files, path } = data
    if (file) {
        await cloudinary.uploader.destroy(file.filename);
    } else if (files) {
        await Promise.all(files.map(async (file) => {
            await cloudinary.uploader.destroy(file.filename);
        }));
    } else if (path) {
        const publicId = getPublicIdFromUrl(path)
        await cloudinary.uploader.destroy(publicId);
    }
}

module.exports = {
    getPublicIdFromUrl,
    deleteImgCloud
};



