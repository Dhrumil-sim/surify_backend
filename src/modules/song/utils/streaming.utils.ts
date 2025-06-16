import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);

export interface StreamingRequest extends Request {
  params: {
    songId: string;
  };
  headers: {
    range?: string;
  };
}

export class AudioStreamingUtil {
  /**
   * Streams audio file with support for range requests (seeking)
   * @param filePath - Path to the audio file
   * @param req - Express request object
   * @param res - Express response object
   */
  static async streamAudio(
    filePath: string,
    req: StreamingRequest,
    res: Response
  ): Promise<void> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'Audio file not found' });
        return;
      }

      // Get file stats
      const fileStats = await stat(filePath);
      const fileSize = fileStats.size;

      // Get file extension to determine MIME type
      const fileExtension = path.extname(filePath).toLowerCase();
      const mimeType = this.getMimeType(fileExtension);

      // Handle range requests for seeking
      const range = req.headers.range;

      if (range) {
        // Parse range header
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        // Validate range
        if (start >= fileSize || end >= fileSize) {
          res.status(416).set({
            'Content-Range': `bytes */${fileSize}`,
          });
          return;
        }

        const chunkSize = end - start + 1;

        // Set headers for partial content
        res.status(206).set({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600',
        });

        // Create read stream for the specified range
        const stream = fs.createReadStream(filePath, { start, end });

        // Handle stream errors
        stream.on('error', (error) => {
          console.error('Stream error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error streaming audio' });
          }
        });

        // Pipe the stream to response
        stream.pipe(res);
      } else {
        // No range request - stream entire file
        res.set({
          'Content-Length': fileSize.toString(),
          'Content-Type': mimeType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        });

        // Create read stream for entire file
        const stream = fs.createReadStream(filePath);

        // Handle stream errors
        stream.on('error', (error) => {
          console.error('Stream error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error streaming audio' });
          }
        });

        // Pipe the stream to response
        stream.pipe(res);
      }
    } catch (error) {
      console.error('Audio streaming error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * Get MIME type based on file extension
   * @param extension - File extension
   * @returns MIME type string
   */
  private static getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.mp4': 'audio/mp4',
      '.m4a': 'audio/mp4',
      '.wav': 'audio/wav',
      '.flac': 'audio/flac',
      '.ogg': 'audio/ogg',
      '.aac': 'audio/aac',
      '.wma': 'audio/x-ms-wma',
    };

    return mimeTypes[extension] || 'audio/mpeg';
  }

  /**
   * Validate if file is a supported audio format
   * @param filePath - Path to the file
   * @returns boolean indicating if file is supported
   */
  static isSupportedAudioFormat(filePath: string): boolean {
    const supportedExtensions = [
      '.mp3',
      '.mp4',
      '.m4a',
      '.wav',
      '.flac',
      '.ogg',
      '.aac',
      '.wma',
    ];
    const extension = path.extname(filePath).toLowerCase();
    return supportedExtensions.includes(extension);
  }

  /**
   * Get audio file metadata for streaming info
   * @param filePath - Path to the audio file
   * @returns Promise with file metadata
   */
  static async getStreamingMetadata(filePath: string): Promise<{
    size: number;
    mimeType: string;
    extension: string;
    isSupported: boolean;
  }> {
    try {
      const fileStats = await stat(filePath);
      const extension = path.extname(filePath).toLowerCase();
      const mimeType = this.getMimeType(extension);
      const isSupported = this.isSupportedAudioFormat(filePath);

      return {
        size: fileStats.size,
        mimeType,
        extension,
        isSupported,
      };
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error}`);
    }
  }
}
