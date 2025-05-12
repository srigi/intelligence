import { app } from 'electron';

export const MAIN_WINDOW_WIDTH = app.isPackaged ? 400 : 1280; // make space for devtools
export const MAIN_WINDOW_HEIGHT = 660;
