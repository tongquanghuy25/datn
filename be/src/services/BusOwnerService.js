const BusOwner = require("../models/BusOwnerModel");
const User = require("../models/UserModel");

const createBusOwner = (newBusOwner) => {
    return new Promise(async (resolve, reject) => {

        const { userId, busOwnerName, address, citizenId, route } = newBusOwner
        console.log('lll', newBusOwner);

        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (checkUser === null) {

                resolve({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                })
            }

            const createdBusOwner = await BusOwner.create({
                userId,
                busOwnerName,
                address,
                citizenId,
                route
            })
            console.log('aaaa', createdBusOwner);

            if (createdBusOwner) {
                resolve({
                    status: 'OK',
                    message: 'Đăng ký nhà xe thành công !',
                    data: createdBusOwner
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBusOwner = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // const busOwners = await BusOwner.find().populate('userId', 'email phone');
            // console.log(busOwners);
            const allBusOwner = await BusOwner.find().populate('userId', 'email phone').sort({ createdAt: -1, updatedAt: -1 })
            // console.log(allBusOwner);

            resolve({
                status: 'OK',
                message: 'Success',
                data: allBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}

const editBusOwner = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('huyaaa', id, data);
            const checkBusOwner = await BusOwner.findOne({
                _id: id
            })
            console.log('lll', checkBusOwner);
            if (checkBusOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'NNhà xe không tồn tại !'
                })
            }
            console.log('loi');

            const updatedBusOwner = await BusOwner.findByIdAndUpdate(id, data, { new: true })
            console.log('loi', updatedBusOwner);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedBusOwner
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteBusOwner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBusOwner = await BusOwner.findOne({
                _id: id
            })
            if (checkBusOwner === null) {
                resolve({
                    status: 'ERR',
                    message: 'The bus owner is not defined'
                })
            }

            await BusOwner.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete bus owner success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBusOwnerNotAccept = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}



// const loginUser = (userLogin) => {
//     return new Promise(async (resolve, reject) => {
//         const { email, password } = userLogin
//         try {
//             const checkUser = await User.findOne({
//                 email: email
//             })
//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Email không chính xác !'
//                 })
//             }
//             const comparePassword = bcrypt.compareSync(password, checkUser.password)

//             if (!comparePassword) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Mật khẩu không chính xác !'
//                 })
//             }
//             const access_token = await genneralAccessToken({
//                 id: checkUser.id,
//                 role: checkUser.role
//             })

//             const refresh_token = await genneralRefreshToken({
//                 id: checkUser.id,
//                 role: checkUser.role
//             })

//             resolve({
//                 status: 'OK',
//                 message: 'Đăng nhập thành công',
//                 access_token,
//                 refresh_token
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }
// const editUser = (id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const checkUser = await User.findOne({
//                 _id: id
//             })
//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Người dùng không tồn tại !'
//                 })
//             }

//             const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
//             resolve({
//                 status: 'OK',
//                 message: 'SUCCESS',
//                 data: updatedUser
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }
// const updateUser = (id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const checkUser = await User.findOne({
//                 _id: id
//             })
//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Người dùng không tồn tại !'
//                 })
//             }

//             const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
//             resolve({
//                 status: 'OK',
//                 message: 'Cập nhật thông tin người dùng thành công !',
//                 data: updatedUser
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const deleteUser = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const checkUser = await User.findOne({
//                 _id: id
//             })
//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The user is not defined'
//                 })
//             }

//             await User.findByIdAndDelete(id)
//             resolve({
//                 status: 'OK',
//                 message: 'Delete user success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const deleteManyUser = (ids) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             await User.deleteMany({ _id: ids })
//             resolve({
//                 status: 'OK',
//                 message: 'Delete user success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const getAllUser = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 })
//             resolve({
//                 status: 'OK',
//                 message: 'Success',
//                 data: allUser
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const getDetailsUser = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const user = await User.findOne({
//                 _id: id
//             })
//             if (user === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The user is not defined'
//                 })
//             }
//             resolve({
//                 status: 'OK',
//                 message: 'SUCESS',
//                 data: user
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

module.exports = {
    createBusOwner,
    getAllBusOwnerNotAccept,
    getAllBusOwner,
    editBusOwner,
    deleteBusOwner

}