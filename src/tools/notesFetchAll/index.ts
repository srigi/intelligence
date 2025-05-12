import { exec } from 'child_process';

function getAllNotes() {
  return new Promise((resolve, reject) => {
    exec(`osascript listNotes.applescript`, (err, stdout) => {
      if (err) return reject(err);

      const notes = stdout
        .split('§§')
        .map((chunk) => {
          const [title, body] = chunk.split('¶');
          return { title, body };
        })
        .filter((n) => n.title);

      resolve(notes);
    });
  });
}

// getAllNotes()
//   .then((notes) => {
//     console.log(notes);
//   })
//   .catch((err) => {
//     throw err;
//   });

export default {
  id: 'notes_fetch_all',
  name: 'Notes · fetch all',
  description: 'Can be used to fetch all notes from the Notes app.',
};
