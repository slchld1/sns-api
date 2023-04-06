const { Schema, model, Types } = require('mongoose');
//import moment for timestamp
const date = require('moment')

//reaction schema

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formattedDate => date(formattedDate).format("MMM DD, YYYY [at] hh:mm a"),
        }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
});
// reaction must be initialized first for us to [reactionSchema]
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formattedDate => date(formattedDate).format("MMM DD, YYYY [at] hh:mm a"),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],

    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)
// virtuals 'reactionCount' retrieves length of reactions
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})




const Thought = model('Thought', thoughtSchema);

module.exports = Thought;