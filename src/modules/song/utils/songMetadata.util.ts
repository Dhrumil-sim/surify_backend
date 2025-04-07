import { parseFile } from 'music-metadata';

class SongMetaData {
  static getMetadata = async (filePath: string) => {
    try {
      console.log('File Path', filePath);
      const metadata = await parseFile(filePath);
      return metadata; // Return the metadata to be used in the controller
    } catch {
      throw new Error('Error parsing metadata');
    }
  };
}

export default SongMetaData;
