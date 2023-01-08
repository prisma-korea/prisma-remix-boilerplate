import type {DetailedHTMLProps, InputHTMLAttributes, ReactElement} from 'react';
import {useEffect, useState} from 'react';

import clsx from 'clsx';

type ClassNames = {
  label?: string;
  input?: string;
  error?: string;
};

type Props = {
  id?: string;
  htmlFor: string;
  label: string;
  className?: string;
  classNames?: ClassNames;
  type?: string;
  value?: any;
  error?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function EditText({
  id,
  htmlFor,
  label,
  type = 'text',
  value,
  onChange,
  error,
  className,
  classNames,
  onSubmit,
  ...restProps
}: Props): ReactElement {
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    setShowError(true);
  }, [error]);

  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={clsx('text-black dark:text-white', classNames?.label)}
      >
        {label}
      </label>
      <input
        {...restProps}
        onChange={(e) => {
          setShowError(false);
          onChange?.(e);
        }}
        type={type}
        id={id}
        name={htmlFor}
        value={value}
        className={clsx(
          `
        w-full p-3 rounded my-2 outline outline-1 focus:outline-2 outline-black
      `,
          classNames?.input,
        )}
      />
      <div
        className={clsx(
          'text-xs tracking-wide text-red w-full',
          classNames?.error,
        )}
      >
        {showError ? error : null}
      </div>
    </div>
  );
}
