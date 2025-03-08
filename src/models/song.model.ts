import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

/**
 * @module Models
 * @description This module contains Mongoose models for the application, including the Song model.
 */

/**
 * Represents the song schema for the application.
 * @typedef {Object} Song
 * @property {ObjectId} artist - The reference to the user who is the artist of the song.
 * @property {string} title - The title of the song.
 * @property {string} [album] - The album in which the song was released (optional).
 * @property {string[]} genre - An array of genre tokens that the song belongs to.
 * @property {Date} release_date - The release date of the song.
 * @property {number} duration - The duration of the song in seconds.
 * @property {string} cover_pic - The URL of the cover image for the song.
 * @property {string} file_path - The path where the song file is stored.
 * @property {Date} createdAt - The timestamp when the song was created.
 * @property {Date} updatedAt - The timestamp when the song was last updated.
 */

const songSchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: User, // Reference to the 'User' model (the artist of the song)
      required: true, // Ensures the song must be associated with an artist
    },
    title: {
      type: String,
      required: true, // Title is required for the song
      trim: true, // Removes extra whitespace from the song title
    },
    album: {
      type: String, // Optional field for the album name
    },
    genre: {
      type: [String], // Array of genre tokens
      required: true, // At least one genre should be associated with the song
    },
    release_date: {
      type: Date,
      required: true, // The release date of the song must be provided
    },
    duration: {
      type: Number,
      required: true, // Duration in seconds
    },
    cover_pic: {
      type: String,
      required: true, // The cover picture URL for the song
    },
    file_path: {
      type: String,
      required: true, // The file path of the song
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' timestamps
  }
);

/**
 * @function Song
 * @memberof module:Models
 * @description The Mongoose model representing a song in the application.
 * @returns {mongoose.Model} The Song model.
 */
export const Song = mongoose.model("Song", songSchema);
