const Review = require("../models/ReviewModel");
const User = require("../models/UserModel");
const BusOwner = require("../models/BusOwnerModel");
const OrderTicket = require("../models/OrderTicketModel");
const { deleteImgCloud } = require("../utils");


const createReview = (newReview) => {
    return new Promise(async (resolve, reject) => {

        try {
            console.log('newReview', newReview);
            const checkUser = await User.findById(newReview.userId)
            if (checkUser === null) {

                resolve({
                    status: 404,
                    message: 'Ngưởi dùng không tồn tại!'
                })
                return;
            }

            const checkBusOwner = await BusOwner.findById(newReview.busOwnerId)
            if (checkBusOwner === null) {

                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            const createdReview = await Review.create(newReview)
            console.log(createReview);
            if (createdReview) {

                const newReviewCount = checkBusOwner.reviewCount + 1;
                const newAverageRating = (checkBusOwner.averageRating * checkBusOwner.reviewCount + newReview.stars) / newReviewCount;

                await BusOwner.findByIdAndUpdate(newReview.busOwnerId, {
                    $set: {
                        averageRating: newAverageRating,
                        reviewCount: newReviewCount
                    }
                });

                await OrderTicket.findByIdAndUpdate(newReview.ticketId, { isReview: true });


                resolve({
                    status: 200,
                    message: 'Đánh giá thành công!',
                    data: createdReview
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


const getReviewsByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allReview = await Review.find({ busOwnerId: busOwnerId })
                .populate('userId')
                .sort({ createdAt: -1 })
            resolve({
                status: 200,
                message: 'Success',
                data: allReview
            })

        } catch (e) {
            reject(e)
        }
    })
}

//

const updateBus = (busId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBus = await Bus.findOne({
                id: busId
            })
            if (checkBus === null) {
                resolve({
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }
            const updatedBus = await Bus.findByIdAndUpdate(busId, { ...data }, { new: true })
            if (updatedBus && data.deleteImages?.length > 0) {
                for (const img of data.deleteImages) {
                    await deleteImgCloud({ path: img })
                }
            }

            console.log('updatedBus', updatedBus);
            resolve({
                status: 200,
                message: 'Cập nhật thông tin xe thành công!',
                data: updateBus
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteBus = (busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBus = await Bus.findOne({
                id: busId
            })
            if (checkBus === null) {
                resolve({
                    status: 404,
                    message: 'Xe không tồn tại!'
                })
                return;
            }

            await Bus.findByIdAndDelete(busId)
            if (checkBus.avatar) await deleteImgCloud({ path: checkBus.avatar })
            if (checkBus.images?.length > 0)
                for (const img of checkBus.images) {
                    await deleteImgCloud({ path: img })
                }
            resolve({
                status: 200,
                message: 'Xóa xe thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
    createReview,
    getReviewsByBusOwner,

    updateBus,
    deleteBus

}