import { parseFile } from 'music-metadata';

class SongMetaData {
  static getMetadata = async (filePath: string) => {
    try {
      const metadata = await parseFile(filePath);
      return metadata; // Return the metadata to be used in the controller
    } catch {
      throw new Error('Error parsing metadata');
    }
  };
}

export default SongMetaData;
