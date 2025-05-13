import { exec } from 'child_process';

export default {
  id: 'notes_fetch_all',
  name: 'Notes · fetch all',
  description: 'Can be used to fetch all notes from the Notes app.',

  handler: () =>
    new Promise((resolve, reject) => {
      exec(`osascript ${import.meta.dirname}/handler.applescript`, (err, stdout) => {
        if (err) return reject(err);

        const notes = stdout
          .split('§§')
          .map((chunk) => {
            const [title, body] = chunk.split('¶');
            return { title, body };
          })
          .filter((n) => n.title && n.body != null);

        resolve(notes);
      });
    }),
};
