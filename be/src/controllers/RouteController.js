const RouteService = require('../services/RouteService');


const addLocation = async (req, res) => {
    try {
        const { province, district, place } = req.body

        if (!province || !district || !place) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await RouteService.addLocation(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const addStopPoint = async (req, res) => {
    try {
        const { province, district, place, timeFromStart, routeId } = req.body
        if (!province || !district || !place || !timeFromStart || !routeId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await RouteService.addStopPoint(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createRoute = async (req, res) => {
    try {
        const { provinceStart, districtStart, provinceEnd, districtEnd, busOwnerId } = req.body

        if (!provinceStart || !districtStart || !provinceEnd || !districtEnd || !busOwnerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await RouteService.createRoute(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getRoutesByBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id

        if (!busOwnerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Nhà xe không được bỏ trống!'
            })
        }


        const response = await RouteService.getRoutesByBusOwner(busOwnerId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getStopPointsByBusRoute = async (req, res) => {
    try {
        const routeId = req.params.id

        if (!routeId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Tuyến xe không được bỏ trống!'
            })
        }


        const response = await RouteService.getStopPointsByBusRoute(routeId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteStopPoint = async (req, res) => {
    try {
        const stopPointId = req.params.id
        if (!stopPointId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id điểm dừng không được bỏ trống !'
            })
        }
        const response = await RouteService.deleteStopPoint(stopPointId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteRoute = async (req, res) => {
    try {
        const routeId = req.params.id
        if (!routeId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id tuyến đường không được bỏ trống !'
            })
        }
        const response = await RouteService.deleteRoute(routeId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateRoute = async (req, res) => {
    try {
        const routeId = req.params.id
        const { provinceStart, districtStart, provinceEnd, districtEnd } = req.body

        if (!provinceStart || !districtStart || !provinceEnd || !districtEnd) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (!routeId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id tuyến đường không được bỏ trống !'
            })
        }
        const response = await RouteService.updateRoute(routeId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPlace = async (req, res) => {
    try {
        const province = req.params.province
        const district = req.params.district
        const response = await RouteService.getAllPlace(province, district)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createBus = async (req, res) => {
    try {
        let { licensePlate, typeBus, type, numberSeat, color, convinients, busOwnerId } = req.body
        const arrPath = req.files.map((file) => file?.path)
        const avatar = arrPath[0]
        const images = arrPath.slice(1)

        if (!licensePlate || !typeBus || !color || !busOwnerId) {
            if (req.file && req.file?.public_id) await deleteImgCloud({ files: req.files })
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (typeBus === 'Khác') {
            typeBus = `${type} ${numberSeat}`
        } else {
            numberSeat = typeBus.split(" ").pop()
        }

        numberSeat = parseInt(numberSeat)

        convinients = convinients?.split(",")


        const response = await BusService.createBus({ licensePlate, typeBus, numberSeat, color, convinients, busOwnerId, images, avatar })
        if (response.status !== 'OK') {
            if (req.files) await deleteImgCloud({ files: req.files })
            return res.status(200).json(response)
        }
        return res.status(200).json(response)



    } catch (e) {
        if (req.files) await deleteImgCloud({ files: req?.files })
        return res.status(404).json({
            message: e.e
        })
    }
}

const getBussByBusOwner = async (req, res) => {
    try {
        const ownerId = req.params.id
        if (!ownerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id nhà xe không đúng!'
            })
        }
        const response = await BusService.getBussByBusOwner(ownerId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}





const getAllBusOwner = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwner()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const editBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        const data = req.body
        if (!busOwnerId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await BusOwnerSevice.editBusOwner(busOwnerId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBusOwnerNotAccept = async (req, res) => {
    try {

        const response = await BusOwnerSevice.getAllBusOwnerNotAccept()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    addLocation,
    addStopPoint,
    createRoute,
    getRoutesByBusOwner,
    getStopPointsByBusRoute,
    deleteStopPoint,
    deleteRoute,
    updateRoute,
    getAllPlace
}
