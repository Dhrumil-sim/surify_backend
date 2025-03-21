import { Request,Response,NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
interface AuthenticatedRequest extends Request {
    cookies: { accessToken?: string , refreshToken?: string}; // Define cookies with accessToken
    user?: any;
}

class SongController{

    static createSong = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { role, _id: artistId } = req.user; // Extract user details
        
        console.log("Uploaded files:", req.files);  // Log all uploaded files

        // Check if the user is an artist
        if (role !== "artist") {
            return res.status(403).json({ message: "Access denied: Only artists can upload songs" });
        }

        // Add the artist ID to the request body
        req.body.artist = artistId;

        // Log the data for debugging
        console.log("Song Data:", req.body);

        // Proceed with song creation (e.g., saving to the database)
        res.status(201).json({ message: "Song created successfully", data: req.body });
    });
    
}

export default SongController;