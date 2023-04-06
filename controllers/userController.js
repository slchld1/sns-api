const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Get one user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => {
                !user
                    ? res.status(404).json({ message: 'User not found.' })
                    : res.json(user)
            })
                .catch((err) => res.status(500).json(err));
    },
    // Create user
    createUsers(req, res) {
        User.create(req.body)
            .then((userData) => res.json(userData))
            .catch((err) => res.status(500).json(err));
    },
    // Update user
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((userData) => 
                !userData
                    ? res.status(404).json({ message: 'User not found.'} )
                    : res.json(userData)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Delete a user
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((userData) => 
                !userData
                    ? res.status(404).json({ message: 'User not found.' })
                    : Thought.deleteMany({ _id: { $in: userData.thoughts }}
                    ).then((userData) => 
                        !userData
                            ? res.status(404).json({ message: 'User does not have any thoughts.'})
                            : res.json({ message: "User and associated Thoughts have been Deleted."})
                        ).catch((err) => {
                            console.log(err);
                            res.status(500).json(err);
                        })

            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    // Post for friends
    // adds each other into friends lists
    addUserFriends(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId},
            { $addToSet: { friends: req.params.friendId } },
            {runValidators: true, new: true}
        )
            .then((userData) => 
                !userData
                    ? res.status(404).json({ message: 'No User exists with this ID.'})
                    : User.findOneAndUpdate(
                        { _id: req.params.friendId },
                        { $addToSet: {friends: req.params.userId} },
                        {runValidators: true, new: true }
                    )
                    .then((userData) => 
                        !userData
                            ? res.status(404).json({ message: 'No User exists with this ID.'})
                            : res.json({ message: "You are now friends."})
                    )
                    .catch((err) => {
                        console.log(err)
                        res.status(500).json(err);
                    })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },
        
    // Deleting a friend

    deleteUserFriends(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((userData) => 
                !userData 
                    ? res.status(404).json({ message: "No User exists with this ID."})
                    : User.findByIdAndUpdate(
                        { _id: req.params.friendId },
                        { $pull: { friends: req.params.userId } },
                        { runValidators: true, new: true}
                    )
                    .then((userData) => 
                        !userData
                            ? res.status(404).json({ message: "No User exists with this ID."})
                            : res.json({ message: "Friend has been deleted..."})
                    )
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json(err);
                    })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },

};