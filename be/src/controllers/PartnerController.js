const PartnerService = require('../services/PartnerService')

const createBusOwner = async (req, res) => {
    try {
        const { email, phone, password, confirmPassword, busOwnerName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = req.body

        if (!email || !phone || !password || !confirmPassword || !busOwnerName || !address || !companyType || !companyDescription || !managerName || !citizenId || !managerPhone || !managerEmail) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ!'
            })
        }
        const response = await PartnerService.createBusOwner(req.body)

        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBusOwner = async (req, res) => {
    try {

        const response = await PartnerService.getAllBusOwner()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const editBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        console.log('aaa');
        const data = req.body
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }

        const response = await PartnerService.editBusOwner(busOwnerId, data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await PartnerService.deleteBusOwner(busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBusOwnerNotAccept = async (req, res) => {
    try {

        const response = await PartnerService.getAllBusOwnerNotAccept()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailBusOwnerByUserId = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await PartnerService.getDetailBusOwnerByUserId(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getOverviewBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const response = await PartnerService.getOverviewBusOwner(busOwnerId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getStatisticBusOwner = async (req, res) => {
    try {
        const busOwnerId = req.params.id
        if (!busOwnerId) {
            return res.status(400).json({
                message: 'Id nhà xe không được bỏ trống !'
            })
        }
        const { tab, startDate, endDate, startOfMonth, endOfMonth, selectedYear } = req.query

        const response = await PartnerService.getStatisticBusOwner(busOwnerId, tab, startDate, endDate, startOfMonth, endOfMonth, selectedYear)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

//AGENT

const createAgent = async (req, res) => {
    try {
        const { email, phone, password, confirmPassword, agentName, address, companyType, companyDescription, managerName, citizenId, managerPhone, managerEmail } = req.body

        console.log(req.body);

        if (!email || !phone || !password || !confirmPassword || !agentName || !address || !companyType || !companyDescription || !managerName || !citizenId || !managerPhone || !managerEmail) {
            return res.status(400).json({
                message: 'Thông tin nhập vào chưa đủ!'
            })
        }
        const response = await PartnerService.createAgent(req.body)

        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllAgent = async (req, res) => {
    try {

        const response = await PartnerService.getAllAgent()
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const editAgent = async (req, res) => {
    try {
        const agentId = req.params.id
        const data = req.body
        if (!agentId) {
            return res.status(400).json({
                message: 'Id đại lý không được bỏ trống !'
            })
        }
        const response = await PartnerService.editAgent(agentId, data)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteAgent = async (req, res) => {
    try {
        const agentId = req.params.id
        if (!agentId) {
            return res.status(400).json({
                message: 'Id đại lý không được bỏ trống !'
            })
        }
        const response = await PartnerService.deleteAgent(agentId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailAgentByUserId = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'Id người dùng không được bỏ trống!'
            })
        }
        const response = await PartnerService.getDetailAgentByUserId(userId)
        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createBusOwner,
    getAllBusOwner,
    getAllBusOwnerNotAccept,
    editBusOwner,
    deleteBusOwner,
    getDetailBusOwnerByUserId,
    getOverviewBusOwner,
    getStatisticBusOwner,

    createAgent,
    getAllAgent,
    editAgent,
    deleteAgent,
    getDetailAgentByUserId
}
