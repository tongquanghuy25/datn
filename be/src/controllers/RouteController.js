const RouteService = require('../services/RouteService');


const addLocation = async (req, res) => {
    try {
        const { province, district, place } = req.body

        if (!province || !district || !place) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await RouteService.addLocation(req.body)
        return res.status(response.status).json(response)

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
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }


        const response = await RouteService.addStopPoint(req.body)
        return res.status(response.status).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createRoute = async (req, res) => {
    try {
        const { provinceStart, districtStart, provinceEnd, districtEnd, busOwnerId, journeyTime, placeStart, placeEnd } = req.body

        if (!provinceStart || !districtStart || !provinceEnd || !districtEnd || !busOwnerId || !journeyTime) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ!'
            })
        }
        if (!placeStart || !placeEnd) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ điểm đón, điểm trả!'
            })
        }

        const response = await RouteService.createRoute(req.body)
        return res.status(response.status).json(response)

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
            return res.status(400).json({
                message: 'Nhà xe không được bỏ trống!'
            })
        }


        const response = await RouteService.getRoutesByBusOwner(busOwnerId)
        return res.status(response.status).json(response)

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
            return res.status(400).json({
                message: 'Tuyến xe không được bỏ trống!'
            })
        }


        const response = await RouteService.getStopPointsByBusRoute(routeId)
        return res.status(response.status).json(response)

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
            return res.status(400).json({
                message: 'Id điểm dừng không được bỏ trống !'
            })
        }
        const response = await RouteService.deleteStopPoint(stopPointId)
        return res.status(response.status).json(response)
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
            return res.statu(400).json({
                status: 'ERR',
                message: 'Id tuyến đường không được bỏ trống !'
            })
        }
        const response = await RouteService.deleteRoute(routeId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateRoute = async (req, res) => {
    try {
        const routeId = req.params.id
        const { provinceStart, districtStart, provinceEnd, districtEnd, journeyTime, placeStart, placeEnd } = req.body

        if (!provinceStart || !districtStart || !provinceEnd || !districtEnd || !journeyTime) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ !'
            })
        }

        if (!routeId) {
            return res.status(400).json({
                message: 'Id tuyến đường không được bỏ trống !'
            })
        }

        if (!placeStart || !placeEnd) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ điểm đón, điểm trả!'
            })
        }
        const response = await RouteService.updateRoute(routeId, req.body)
        return res.status(response.status).json(response)
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


const getPlacesBySearchTrip = async (req, res) => {
    try {
        const data = req.query
        const response = await RouteService.getPlacesBySearchTrip(data)
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
    getAllPlace,
    getPlacesBySearchTrip
}
