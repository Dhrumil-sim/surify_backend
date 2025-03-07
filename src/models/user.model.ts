import mongoose, { Schema } from "mongoose";

/**
 * @module Models
 * @description This module contains Mongoose models for the application, including the User model.
 */

/**
 * Represents the user schema for the application.
 * @typedef {Object} User
 * @property {string} username - The unique username for the user.
 * @property {string} email - The unique email address for the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} [profile_picture] - The URL of the user's profile picture (optional).
 * @property {Date} joining_date - The date the user joined (default is the current date).
 * @property {string} [refresh_token] - The refresh token associated with the user (optional).
 * @property {string} role - The role of the user, either 'user' or 'artist'.
 * @property {Date} createdAt - The timestamp when the user was created.
 * @property {Date} updatedAt - The timestamp when the user was last updated.
 */


const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // Exclude password from being returned in queries by default
        },
        profile_picture: {
            type: String,
            trim: true,
        },
        joining_date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        refresh_token: {
            type: String,
            select: false, // Exclude refresh_token from being returned by default
        },
        role: {
            type: String,
            enum: ['user', 'artist'],
            required: true,
            default: 'user', // Default to 'user'
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

/**
 * @function User
 * @memberof module:Models
 * @description The Mongoose model representing a user in the application.
 * @returns {mongoose.Model} The User model.
 */
export const User = mongoose.model("User", UserSchema);
