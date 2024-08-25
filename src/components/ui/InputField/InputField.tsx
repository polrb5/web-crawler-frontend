import { ChangeEvent } from 'react';

import clsx from 'clsx';

import styles from './InputField.module.scss';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  showError?: boolean;
  placeholder?: string;
}

const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  showError = false,
  placeholder = '',
}: InputFieldProps) => (
  <div className={styles['input-wrapper']}>
    <label htmlFor={name}>{label}</label>
    <input
      className={clsx(styles['input-wrapper__field'], {
        [styles['input-wrapper__field--required']]: showError,
      })}
      id={name}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
    {required && showError && (
      <span className={styles['input-wrapper__error']}>Required field</span>
    )}
  </div>
);

export default InputField;
