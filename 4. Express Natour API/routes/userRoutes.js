
const express = require('express');
const userController = require('./../controller/userController');
//const {getAllUsers, createUser, getUser, updateUser,deleteUser} = require('./../controller/userController');
const router = express.Router(); // reemplazamos app con la instancia de express.Router() en usersRouter

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;   