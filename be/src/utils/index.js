const cloudinary = require('cloudinary').v2;

const getPublicIdFromUrl = (url) => {
    // Chia chuỗi URL thành mảng các phần tử bằng dấu '/'
    const parts = url.split('/');

    // Tìm và trả về phần tử cuối cùng của mảng, đó là public ID
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



