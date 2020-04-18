const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task = require('./task.js')
const myschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('ENter valid email')
            }
        }

    },
    age: {
        default: 0,
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Enter positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6)
                throw new Error('Enter longer password')
            if (value === 'paswword')
                throw new Error('Try another password');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},

    {
        timestamps: true
    })

myschema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


myschema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;



}

myschema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }


    next();
})

myschema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })

    next();
})
myschema.methods.genertateoftoken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: '7 days' })

    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}
myschema.methods.toJSON = function () {
    const user = this;
    const userobject = user.toObject();

    delete userobject.password;
    delete userobject.tokens;
    delete userobject.avatar
    return userobject;
}

const User = mongoose.model('User', myschema);
module.exports = User