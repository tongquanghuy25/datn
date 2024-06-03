const { User, BusOwner, Review, OrderTicket } = require("../models/index");

const createReview = (newReview) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findByPk(newReview.userId);
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Ngưởi dùng không tồn tại!'
                })
                return;
            }

            const checkBusOwner = await BusOwner.findByPk(newReview.busOwnerId);
            if (checkBusOwner === null) {
                resolve({
                    status: 404,
                    message: 'Nhà xe không tồn tại!'
                })
                return;
            }

            const createdReview = await Review.create(newReview)
            if (createdReview) {
                const newReviewCount = checkBusOwner.reviewCount + 1;
                const newAverageRating = (checkBusOwner.averageRating * checkBusOwner.reviewCount + newReview.stars) / newReviewCount;

                await BusOwner.update({
                    averageRating: newAverageRating,
                    reviewCount: newReviewCount
                }, {
                    where: {
                        id: newReview.busOwnerId
                    }
                });

                await OrderTicket.update({ isReview: true }, { where: { id: newReview.ticketId } });

                resolve({
                    status: 200,
                    message: 'Đánh giá thành công!',
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
            const allReview = await Review.findAll({
                where: { busOwnerId },
                include: [{ model: User, as: 'user' }],
                order: [['createdAt', 'DESC']]
            });

            resolve({
                status: 200,
                message: 'Success',
                data: allReview
            })

        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}



module.exports = {
    createReview,
    getReviewsByBusOwner,
}