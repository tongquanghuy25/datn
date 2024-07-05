const { User, Bus, Driver, BusOwner } = require("../models/index")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { deleteImgCloud, generateRandomCode } = require("../utils");
const { sendEmailResetPassword, sendEmail } = require("./EmailService");
const { raw } = require("body-parser");
const { Op, Sequelize } = require('sequelize');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, phone, name, dateOfBirth, gender, password, avatar, role } = newUser
        try {
            const checkUser = await User.findOne({
                where: {
                    email: email
                }
            });
            if (checkUser !== null) {
                resolve({
                    status: 400,
                    message: 'Email đã tồn tại!'
                })
                return
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                email,
                password: hash,
                phone,
                name,
                dateOfBirth,
                gender,
                avatar,
                role
            });
            if (createdUser) {
                resolve({
                    status: 200,
                    message: 'Đăng ký tài khoản thành công!',
                    data: createdUser
                })
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                where: {
                    email: email
                },
                raw: true
            })
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Email không chính xác!'
                })
                return;
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 400,
                    message: 'Mật khẩu không chính xác!'
                })
                return;
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                role: checkUser.role
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                role: checkUser.role
            })

            // for (let i = 0; i < 100; i++) {
            //     const hash = bcrypt.hashSync('123456', 10)
            //     const email = `test${i}@gmail.com`
            //     const phone = '01234567890'
            //     const name = 'test'
            //     await User.create({
            //         email,
            //         password: hash,
            //         phone,
            //         name,
            //     });
            // }

            resolve({
                status: 200,
                message: 'Đăng nhập thành công!',
                access_token,
                refresh_token
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const editUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findByPk(id);
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            if (data.email) {
                const checkEmail = await User.findOne({
                    where: { email: data?.email },
                    raw: true
                });
                if (checkEmail !== null && checkEmail.email !== data?.email) {
                    resolve({
                        status: 400,
                        message: 'Email đã tồn tại!'
                    })
                    return;
                }
            }

            await User.update(data, {
                where: { id: id }
            });

            resolve({
                status: 200,
                message: 'Chỉnh sửa người dùng thành công!',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findByPk(id, { raw: true });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }
            if (data.email) {
                const checkEmail = await User.findOne({
                    where: { email: data?.email },
                    raw: true
                });
                if (checkEmail !== null && checkEmail.email !== data?.email) {
                    resolve({
                        status: 400,
                        message: 'Email đã tồn tại!'
                    })
                    return;
                }
            }

            await User.update(data, {
                where: { id: id }
            });

            if (checkUser?.avatar && data.avatar) {
                deleteImgCloud({ path: checkUser?.avatar })
            }

            const updateUser = { ...checkUser, data }
            resolve({
                status: 200,
                message: 'Cập nhật thông tin người dùng thành công!',
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const changePassword = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const checkUser = await User.findByPk(id);
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            const comparePassword = bcrypt.compareSync(data.password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 400,
                    message: 'Mật khẩu không chính xác!'
                })
                return;
            }

            const hashNew = bcrypt.hashSync(data.newPassword, 10)

            await User.update({ password: hashNew }, { where: { id: id } });
            resolve({
                status: 200,
                message: 'Đổi mật khẩu thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const resetPassword = (email, phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                where: { email: email, phone: phone }
            });
            if (checkUser === null) {
                resolve({
                    status: 404,
                    message: 'Thông tin nhập vào không đúng!'
                })
                return;
            }

            const password = generateRandomCode(8)
            const hash = bcrypt.hashSync(password, 10)
            const updatedUser = await User.update({ password: hash }, {
                where: { id: checkUser.id },
            })

            await sendEmailResetPassword(password)

            resolve({
                status: 200,
                message: 'Cập nhật thông tin người dùng thành công!',
                data: updatedUser
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                where: { id: id },
                raw: true
            });
            if (checkUser === null) {
                resolve({
                    status: 400,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            await User.destroy({ where: { id: id } });
            if (checkUser?.avatar) deleteImgCloud({ path: checkUser?.avatar })
            resolve({
                status: 200,
                message: 'Xóa người dùng thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = (page, pageSize) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const allUser = await User.findAll({
            //     order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
            //     raw: true
            // });
            const { count, rows } = await User.findAndCountAll({
                offset: (page - 1) * pageSize,
                limit: pageSize,
                order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
                raw: true
            });


            resolve({
                status: 200,
                message: 'Success',
                data: {
                    users: rows,
                    total: count,
                }
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                where: { id: id },
                raw: true
            });
            if (user === null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }

            resolve({
                status: 200,
                message: 'SUCESS',
                data: user
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const sentMailAdmin = (to, subject, content) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users;
            if (to === 'Tất cả') {
                users = await User.findAll({
                    where: { role: { [Op.notIn]: ['ADMIN'] } },
                    raw: true
                });
            } else if (to === 'Nhà xe') {
                users = await User.findAll({
                    where: { role: 'BUSOWNER' },
                    raw: true
                });
            } else if (to === 'Đại lý') {
                users = await User.findAll({
                    where: { role: 'AGENT' },
                    raw: true
                });
            } else if (to === 'Tài xế') {
                users = await User.findAll({
                    where: { role: 'DRIVER' },
                    raw: true
                });
            } else if (to === 'Người dùng') {
                users = await User.findAll({
                    where: { role: 'USER' },
                    raw: true
                });
            } else {
                users = await User.findAll({
                    where: { email: to },
                });

            }

            if (users == null) {
                resolve({
                    status: 404,
                    message: 'Người dùng không tồn tại!'
                })
                return;
            }
            const emails = users?.map(item => item.email)
            await sendEmail(emails.join(','), subject, content)
            resolve({
                status: 200,
                message: 'SUCESS',
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

const getDataAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const numUser = await User.count();
            const numBus = await Bus.count();
            const numDriver = await Driver.count();
            const numBusOwner = await BusOwner.count();

            console.log(numUser, numBusOwner, numBus, numDriver);

            const currentDate = new Date();
            const twelveMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1); // 12 months ago
            const result = await User.findAll({
                attributes: [
                    [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                    [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                    [Sequelize.literal('COUNT(*)'), 'count'],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: twelveMonthsAgo,
                    },
                },
                group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
                order: [[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'ASC'], [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']],
            });


            const monthNames = [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ];

            // Tạo mảng data theo yêu cầu
            const dataNewUser = result.map(item => ({
                month: monthNames[item.dataValues.month - 1], // Month starts from 1
                newUser: item.dataValues.count
            }));

            resolve({
                status: 200,
                message: 'SUCESS',
                data: {
                    numUser,
                    numBusOwner,
                    numBus,
                    numDriver,
                    dataNewUser
                }
            })
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    changePassword,
    resetPassword,
    editUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    sentMailAdmin,
    getDataAdmin
}