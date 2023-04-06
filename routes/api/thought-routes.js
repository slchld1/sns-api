const router = require('express').Router();
const { getThoughts, getThoughtById, createThought, updateThought, delThought, addReactions, delReaction } = require('../../controllers/thoughtController');



// api/thoughts Get and create thoughts
router.route('/').get(getThoughts).post(createThought);


// api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(delThought);

// api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReactions)

// api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(delReaction)


module.exports = router;