const router = require('express').Router();
const { getUsers, getSingleUser, createUsers, updateUser, deleteUser, addUserFriends, deleteUserFriends } = require('../../controllers/userController');


// /api/users
router.route('/').get(getUsers).post(createUsers);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addUserFriends).delete(deleteUserFriends);


module.exports = router;