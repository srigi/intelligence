import { type ComponentPropsWithoutRef, type ReactElement } from 'react';

import Toast from './Toast';
import ToastAction from './ToastAction';

export type ToastProps = ComponentPropsWithoutRef<typeof Toast>;
export type ToastActionElement = ReactElement<typeof ToastAction>;

export { Root as ToastRoot } from '@radix-ui/react-toast';
export { default as Toast } from './Toast';
export { default as ToastAction } from './ToastAction';
export { default as ToastClose } from './ToastClose';
export { default as ToastDescription } from './ToastDescription';
export { default as ToastTitle } from './ToastTitle';
export { default as ToastViewport } from './ToastViewport';
