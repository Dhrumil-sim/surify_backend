import crypto from 'crypto';
import fs from 'fs';
import { ISong } from 'models/song.model';
export class SongFileHash {
  static fileHash = (
    filePath: ISong['filePath']
  ): Promise<ISong['fileHash']> => {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      console.log(filePath);
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  };
}
