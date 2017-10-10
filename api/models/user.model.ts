import { Document, Schema, Model } from 'mongoose';
import * as validator from 'validator';
import * as crypto from 'crypto';
let owasp = require('owasp-password-strength-test');

import * as api from '../../api';


let mongoose = api.helpers.DataAccess.mongooseInstance;

interface UserOperation {
    authenticate(password: string): boolean;
    hashPassword(password: string): string;
}

export interface UserModel extends api.interfaces.User, UserOperation, Document { }

const validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};
const validateLocalStrategyEmail = function (email) {
    return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};


let schema = new Schema({
    firstName: {
        type: String, trim: true, default: '', validate: [validateLocalStrategyProperty, 'Please fill in your first name'],
    },
    lastName: {
        type: String, trim: true, default: '', validate: [validateLocalStrategyProperty, 'Please fill in your last name'],
    },
    displayName: { type: String, trim: true },
    email: {
        type: String, unique: true, lowercase: true, trim: true, default: '',
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
    },
    username: { type: String, unique: 'Username already exists', required: 'Please fill in a username', lowercase: true, trim: true },
    password: { type: String, default: '' },
    salt: { type: String },
    access_token: { type: String },
    profileImageURL: { type: String, default: 'modules/users/client/img/profile/default.png' },
    provider: { type: String, required: 'Provider is required' },
    providerData: {},
    additionalProvidersData: {},
    roles: { type: [{ type: String, enum: ['user', 'admin'] }], default: ['user'], required: 'Please provide at least one role' },
    updated: { type: Date },
    created: { type: Date, default: Date.now },
    /* For reset password */
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

schema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Hook a pre validate method to test the local password
 */
schema.pre('validate', function (next) {
    if (this.provider === 'local' && this.password && this.isModified('password')) {
        let result = owasp.test(this.password);
        if (result.errors.length) {
            let error = result.errors.join(' ');
            this.invalidate('password', error);
        }
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
schema.methods.hashPassword = function (password): string {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'base64').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
schema.methods.authenticate = function (password): boolean {
    return this.password === this.hashPassword(password);
};

export interface IUserStatic extends Model<UserModel> {
    findUniqueUsername: (username: string, suffix: string) => Promise<string>;
    findByEmailAddress(emailAddress: string): Promise<UserModel>;
}

schema.statics.findUniqueUsername = async function (username, suffix): Promise<string | undefined> {
    let _this: IUserStatic = this;
    let possibleUsername = username.toLowerCase() + (suffix || '');
    try {
        let user = await _this.findOne({ username: possibleUsername }).exec();
        if (!user) {
            Promise.resolve(possibleUsername);
        } else {
            return await _this.findUniqueUsername(username, (suffix || 0) + 1);
        }
    } catch (err) {
        Promise.reject(err);
    }
};

schema.statics.findByEmailAddress = async (emailAddress: string) => {
    return this.userModel.findOne({ email: emailAddress }).exec();
};

export let userModel = <IUserStatic>mongoose.model<UserModel>('user', schema);
