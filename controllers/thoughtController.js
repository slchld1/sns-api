const { User, Thought } = require('../models');

module.exports = {
    // GET all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughtData) => res.json(thoughtData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Find One Tought by ID
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select("-__v")
            .then((thoughtData) => 
                !thoughtData
                    ? res.status(404).json({ message: 'Thought does not exist.'})
                    : res.json(thoughtData)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //Create a Thought
    createThought(req, res) {
        Thought.create(req.body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: "User does not Exist." })
              : res.json(user)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
    //Update a Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, New: true },
        )
        .then((thoughtData) => 
            !thoughtData
                ? res.status(404).json({ message: "Thought does not Exist."})
                : res.json(thoughtData)
        )
        .catch((err) => {
            console.log(err)
            res.status(500).json(err);
        });
    },

    //Delete a thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId})
            .then((thoughtData) => 
                !thoughtData
                    ? res.status(404).json({ message: "Thought does not Exist" })
                    // Must update user to remove thought
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: {thoughts: req.params.thoughtId}},
                        { new: true }
                    )
            )
            .then((userData) => 
                !userData
                    ? res.status(404).json({ message: "User does not Exist."} )
                    : res.json({ message: "Successfully deleted thought"})
            )
            .catch((err) => {
                console.log(err)
                res.status(500).json(err);
            })
    }
}
