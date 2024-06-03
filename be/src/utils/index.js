const cloudinary = require('cloudinary').v2;
const axios = require('axios');

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



const clientId = "AWVxc3TU97rliYKxzs6BEGVorN2O4yV199eB_fOoCxxqFydtJSssQ36syhk2xS6DbGN6CuupBPIZR4g9";
const secret = "EO2mAYZW4S6dyXPaZfswXVNi5yQ8FkBWI9CwZIbMut1mRMdJyVgXc3Ul_77xkyJ8zbu2LEVh81mVCr3s";

async function getAccessToken() {
    try {
        const response = await axios.post(
            "https://api.sandbox.paypal.com/v1/oauth2/token",
            `grant_type=client_credentials`,
            {
                auth: {
                    username: clientId,
                    password: secret
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        return null;
    }
}

async function checkTransactionStatus(transactionId) {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.error("Unable to get access token.");
            return;
        }

        const response = await axios.get(
            `https://api.sandbox.paypal.com/v2/checkout/orders/${transactionId}`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );
        const transactionStatus = response.data.status;
        // console.log("Transaction Status:", transactionStatus);
        if (transactionStatus === 'COMPLETED') {
            console.log('check transaction complete');
            return true
        }
        else return false
    } catch (error) {
        console.error("Error checking transaction status:");
    }
}

const cancelTransaction = async (transactionId) => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.error("Unable to get access token.");
            return;
        }
        console.log('transactionId', transactionId);
        const response = await axios.post(
            `https://api.sandbox.paypal.com/v2/checkout/orders/${transactionId}/refund`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('response.data');
        // return response.data;
    } catch (error) {
        console.error('Error canceling transaction:', error.message);
        // throw error;
    }
};

const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getCurrentDateString() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 ở đầu nếu cần
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng và thêm số 0 ở đầu nếu cần (tháng bắt đầu từ 0)
    const year = String(today.getFullYear()).slice(-2); // Lấy 2 chữ số cuối của năm

    return `${day}/${month}/${year}`;
}

// const parseDate = (str) => {
//     const [day, month, year] = str.split('-').map(Number);
//     // Giả sử năm là 20xx nếu yy < 50, và 19xx nếu yy >= 50
//     return new Date(year, month - 1, day); // Tháng trong JavaScript bắt đầu từ 0
// }

// function isDateInRange(startDateStr, endDateStr) {
//     const currentDate = new Date();
//     const startDate = parseDate(startDateStr);
//     const endDate = parseDate(endDateStr);

//     return currentDate >= startDate && currentDate <= endDate;
// }

function isDateInRange(startDate, endDate) {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return currentDate >= start && currentDate <= end;
}

module.exports = {
    getPublicIdFromUrl,
    deleteImgCloud,
    checkTransactionStatus,
    cancelTransaction,
    generateRandomCode,
    isDateInRange
};



