const { Discount } = require("../models/index");
const { Sequelize } = require('sequelize');
const { generateRandomCode, isDateInRange } = require("../utils");


const createDiscount = (newDiscount) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (newDiscount.code) {
                const checkDiscount = await Discount.findOne({
                    where: {
                        code: newDiscount.code
                    }
                });

                if (checkDiscount !== null) {

                    resolve({
                        status: 404,
                        message: 'Mã giảm giá đã tồn tại!'
                    })
                    return;
                }
            } else {
                while (!newDiscount.code) {
                    const code = generateRandomCode(8);
                    const checkDiscount = await Discount.findOne({
                        where: {
                            code: code
                        }
                    });
                    if (checkDiscount === null) {
                        newDiscount.code = code
                    }
                }
            }

            const createdDiscount = await Discount.create(newDiscount)

            if (createdDiscount) {
                resolve({
                    status: 200,
                    message: 'Thêm mã giảm giá thành công!',
                    data: createdDiscount
                })
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const checkDiscount = (code, busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const discount = await Discount.findOne({ where: { code: code } });
            console.log('discount', discount);
            if (discount === null || !isDateInRange(discount.startDate, discount.endDate) || discount.numberUses < 1) {
                resolve({
                    status: 400,
                    message: 'Mã giảm giá không tồn tại!'
                })
                return;
            }
            if (discount.busOwnerId) {
                if (discount.busOwnerId.toString() !== busOwnerId) {
                    resolve({
                        status: 400,
                        message: 'Mã giảm giá không dành cho nhà xe này!'
                    })
                    return;
                }
            }

            const result = await Discount.update(
                { numberUses: Sequelize.literal('numberUses - 1') },
                { where: { code: code, numberUses: { [Sequelize.Op.gte]: 1 } } }
            );

            if (result) {
                resolve({
                    status: 200,
                    message: 'Success',
                    data: { discountType: discount.discountType, discountValue: discount.discountValue }
                })
            }

        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allDiscounts = []
            if (busOwnerId !== 'ALL') {
                allDiscounts = await Discount.findAll({
                    where: { busOwnerId: busOwnerId }
                });

            } else {
                allDiscounts = await Discount.findAll({
                    where: {
                        [Sequelize.Op.or]: [
                            { busOwnerId: null },
                            { busOwnerId: { [Sequelize.Op.not]: { [Sequelize.Op.exists]: true } } }
                        ]
                    }
                });
            }

            // const allDiscounts = await Discount.find({
            //     busOwnerId: busOwnerId
            // })

            resolve({
                status: 200,
                message: 'Success',
                data: allDiscounts
            })


        } catch (e) {
            reject(e)
        }
    })
}

const deleteDiscount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Discount.destroy({ where: { id: id } });
            resolve({
                status: 200,
                message: 'Xóa mã giảm giá thành công!',
            })


        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createDiscount,
    checkDiscount,
    getByBusOwner,
    deleteDiscount

}