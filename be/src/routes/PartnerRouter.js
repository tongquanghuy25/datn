const express = require("express");
const router = express.Router()
const PartnerController = require('../controllers/PartnerController');
const { authAdminMiddleWare, authUserMiddleWare, authBusOwnerMiddleWare, authAgentMiddleWare } = require("../middleware/authMiddleware");

router.post('/register-bus-owner', PartnerController.createBusOwner)
router.get('/get-all-bus-owner', authAdminMiddleWare, PartnerController.getAllBusOwner)
router.put('/edit-bus-owner/:id', authAdminMiddleWare, PartnerController.editBusOwner)
router.delete('/delete-bus-owner/:id', authAdminMiddleWare, PartnerController.deleteBusOwner)
router.get('/get-all-partner-not-accept', authAdminMiddleWare, PartnerController.getAllBusOwnerNotAccept)
router.get('/get-detail-bus-owner-by-userId/:id', authBusOwnerMiddleWare, PartnerController.getDetailBusOwnerByUserId)
router.get('/overview-bus-owner/:id', authBusOwnerMiddleWare, PartnerController.getOverviewBusOwner)
router.get('/statistic-bus-owner/:id', authBusOwnerMiddleWare, PartnerController.getStatisticBusOwner)


router.post('/register-agent', PartnerController.createAgent)
router.get('/get-all-agent', authAdminMiddleWare, PartnerController.getAllAgent)
router.put('/edit-agent/:id', authAdminMiddleWare, PartnerController.editAgent)
router.delete('/delete-agent/:id', authAdminMiddleWare, PartnerController.deleteAgent)
router.get('/get-detail-agent-by-userId/:id', authAgentMiddleWare, PartnerController.getDetailAgentByUserId)

module.exports = router