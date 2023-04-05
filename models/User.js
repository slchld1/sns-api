const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: { 
                //match isEmail
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
            },
        },
        thoughts: [
            {
                //ref to thought
                type: Schema.Types.ObjectId,
                ref: "thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                //ref to user
                ref: "User"
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);
// schema setting virtual 'friendCount' to retrieve friends.length
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema)

module.exports = User;