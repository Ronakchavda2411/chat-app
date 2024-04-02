const express =  require("express");
const  router  = express.Router()
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupchat, renameGroup, addToGroup, removeFromgroup } = require("../controller/chatController");

router.post('/',protect,accessChat);
router.get('/',protect,fetchChats);
router.post('/group',protect,createGroupchat);
router.put('/rename',protect,renameGroup)
router.put('/groupremove',protect,removeFromgroup)
router.put('/groupadd',protect,addToGroup)


module.exports = router 