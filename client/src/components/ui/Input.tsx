import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps): JSX.Element {
  return <input className={[styles.input, className ?? ''].filter(Boolean).join(' ')} {...props} />;
}
