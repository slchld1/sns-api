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
    getThoughtById(req, res) {
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
              { username: req.body.username },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: "User does not Exist." })
              : res.json(userData)
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
            { validators: true, New: true },
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
    delThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId})
            .then((thoughtData) => 
                !thoughtData
                    ? res.status(404).json({ message: "Thought does not Exist" })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId }},
                        { new: true}
                        )
                        .then((userData) => 
                            !userData
                                ? res.status(404).json({ message: "User with this Thought does not Exist"} ) 
                                : res.json({ message: "Thought has been deleted."})
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

    // Reactions
    // Add Reaction
    addReactions(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((thoughtData) => 
            !thoughtData
                ? res.status(404).json({ message: "Thought does not Exist"})
                : res.json(thoughtData)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Delete Reaction
    delReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }} },
            { runValidator: true, new: true }
        )
        .then((thoughtData) => 
            !thoughtData
                ? res.status(404).json({ message: "Thought does not Exist "})
                : res.json({ message: "Reaction has been successfully removed" })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
            
    }
}
