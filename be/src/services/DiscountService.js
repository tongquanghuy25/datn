const BusOwner = require("../models/BusOwnerModel");
const Discount = require("../models/DiscountModel");
const { generateRandomCode, isDateInRange } = require("../utils");


const createDiscount = (newDiscount) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (newDiscount.code) {
                const checkDiscount = await Discount.findOne({
                    code: newDiscount.code
                })
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
                        code: code
                    })
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
            const discount = await Discount.findOne({ code: code })
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

            const result = await Discount.findOneAndUpdate(
                {
                    code: code,
                    numberUses: { $gte: 1 }
                },
                {
                    $inc: {
                        numberUses: -1
                    }
                },
                { new: true }

            )
            resolve({
                status: 200,
                message: 'Success',
                data: { discountType: result.discountType, discountValue: result.discountValue }
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getByBusOwner = (busOwnerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allDiscounts = []
            if (busOwnerId !== 'ALL') {
                allDiscounts = await Discount.find({
                    busOwnerId: busOwnerId
                })
            } else {
                allDiscounts = await Discount.find({
                    $or: [
                        { busOwnerId: null },
                        { busOwnerId: { $exists: false } }
                    ]
                })

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
            const discount = await Discount.findByIdAndDelete(id)
            resolve({
                status: 200,
                message: 'Xóa mã giảm giá thành công!',
                data: discount
            })


        } catch (e) {
            reject(e)
        }
    })
}



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
    createDiscount,
    checkDiscount,
    getByBusOwner,
    deleteDiscount

}