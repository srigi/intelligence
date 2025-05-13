import { Type } from '@google/genai';
import { spawn } from 'child_process';

export default {
  id: 'photos_get_last_photo',
  name: 'Photos · get the last photo',
  description: 'Can be used to get the last photo from the specified directory.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      exportDir: {
        type: Type.STRING,
        description: 'Path to the directory to export the photo to. Defaults to ".out" folder in the current working directory.',
      },
      filename: {
        type: Type.STRING,
        description: 'Name of the resulting file. Defaults to "last.jpg".',
      },
    },
    required: [],
  },

  /**
   * @param {object} opts
   * @param {string} [opts.exportDir=cwd]       – name of the output folder, defaults to '.out' folder in the current working directory
   * @param {string} [opts.filename="last.jpg"] – name of the resulting file, defaults to "last.jpg"
   *
   * @returns {Promise<string>}                 – resolves to the JXA script’s stdout
   */
  handler: async function fetchLastPhoto({ exportDir = `${import.meta.dirname}/.out`, filename = 'last.jpg' }) {
    const scriptPath = `${import.meta.dirname}/handler.scpt`;

    return new Promise((resolve, reject) => {
      const proc = spawn('osascript', [scriptPath, exportDir, filename]);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (d) => {
        stdout += d.toString();
      });
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          console.info('Successfully saved last photo to:', stdout.trim());
          resolve({ lastPhotoFilePath: stdout.trim() });
        } else {
          reject(new Error(`osascript failed (code ${code}): ${stderr.trim()}`));
        }
      });
    });
  },
};
