import { Type } from '@google/genai';
import { spawn } from 'child_process';

/**
 * Add an event to macOS Calendar via your JXA script.
 */
export default {
  id: 'calendar_add_event',
  name: 'Calendar · add event',
  description: 'Can be used to add an event to the specified calendar.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      calendar: {
        type: Type.STRING,
        description: 'Name of the calendar to add the event to.',
      },
      title: {
        type: Type.STRING,
        description: 'The title of the event.',
      },
      startDateTime: {
        type: Type.STRING,
        description: 'The start date of the event in ISO 8601 format.',
      },
      endDateTime: {
        type: Type.STRING,
        description: 'The end date of the event in ISO 8601 format.',
      },
      url: {
        type: Type.STRING,
        description: 'The URL of the event.',
      },
      travel: {
        type: Type.NUMBER,
        description: 'The travel time in minutes.',
      },
      location: {
        type: Type.STRING,
        description: 'The location of the event.',
      },
    },
    required: ['calendar', 'title', 'startDateTime', 'endDateTime'],
  },

  /**
   * @param {object} opts
   * @param {string} opts.calendar      – name of the target calendar
   * @param {string} opts.title         – event title
   * @param {string} opts.startDateTime – Date and time for start in format based on ISO 8601
   * @param {string} opts.endDateTime   – Date and time for end
   * @param {string} [opts.url=""]      – optional URL
   * @param {number} [opts.travel=0]    – travel time in minutes
   * @param {string} [opts.location=""] – optional location
   *
   * @returns {Promise<string>}  – resolves to the JXA script’s stdout
   */
  handler: async ({ calendar, title, startDateTime, endDateTime, url = '', travel = 0, location = '' }) => {
    const scriptPath = `${import.meta.dirname}/handler.js`;
    const args = ['-l', 'JavaScript', scriptPath, calendar, title, startDateTime, endDateTime, url, String(travel), location];

    console.log(`Running osascript with args: `, args);

    return new Promise((resolve, reject) => {
      const proc = spawn('osascript', args);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ result: stdout.trim() });
        } else {
          reject(new Error(`osascript failed (code ${code}): ${stderr.trim()}`));
        }
      });
    });
  },
};
