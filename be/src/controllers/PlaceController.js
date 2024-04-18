const PlaceService = require('../services/PlaceService')

const addPlace = async (req, res) => {
    try {

        const response = await PlaceService.addPlace()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    addPlace
}