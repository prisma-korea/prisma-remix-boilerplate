import type {ActionFunction, LoaderFunction} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import {getUser, register, signIn} from '~/utils/auth.server';
import i18next, {t} from 'i18next';
import {json, redirect} from '@remix-run/node';
import {useEffect, useRef, useState} from 'react';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '~/utils/validators.server';

import {EditText} from '../components/edit-text';
import {useTranslation} from 'react-i18next';

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request);

  return user ? redirect('/') : null;
};

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData();
  const action = form.get('_action');
  const email = form.get('email');
  const password = form.get('password');
  let displayName = form.get('displayName');

  if (
    typeof action !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return json({error: i18next.t('BAD_REQUEST'), form: action}, {status: 400});
  }

  if (action === 'register' && typeof displayName !== 'string') {
    return json({error: t('BAD_REQUEST'), form: action}, {status: 400});
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === 'register'
      ? {
          displayName: validateName((displayName as string) || ''),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {errors, fields: {email, password, displayName}, form: action},
      {status: 400},
    );

  switch (action) {
    case 'sign-in': {
      return await signIn({email, password});
    }
    case 'register': {
      displayName = displayName as string;
      return await register({email, password, displayName});
    }
    default:
      return json({error: t('BAD_REQUEST')}, {status: 400});
  }
};

export default function SignIn() {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || '');
  const [action, setAction] = useState('sign-in');
  const {t} = useTranslation();

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: '',
        password: '',
        displayName: '',
      };

      setErrors(newState);
      setFormError('');
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError('');
    }
  }, []);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <div className="h-screen w-full bg-white dark:bg-slate-800">
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <button
          onClick={() =>
            setAction(action == 'sign-in' ? 'register' : 'sign-in')
          }
          className="
            absolute top-8 right-8
            bg-black dark:bg-white
            text-white dark:text-black
            rounded px-3 py-2 transition duration-300 ease-in-out hover:opacity-70 hover:-translate-y-1
          "
        >
          {(action === 'sign-in' ? t('SIGN_IN') : t('SIGN_UP')) as string}
        </button>
        <Form
          method="post"
          className="px-8 py-16 w-96 border-transparent border-2 rounded shadow-xl"
        >
          <div className="text-xs text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          <h2
            className="
              text-5xl mb-4
              text-center
              text-black dark:text-white
            "
          >
            {(action === 'sign-in' ? t('SIGN_IN') : t('SIGN_UP')) as string}
          </h2>
          <p
            className="
              text-opacity-60 mb-12 text-center 
              text-black dark:text-white "
          >
            {
              (action === 'sign-in'
                ? t('SIGN_IN_DESC')
                : t('SIGN_UP_DESC')) as string
            }
          </p>
          <EditText
            htmlFor="email"
            label={t('EMAIL') as string}
            value=""
            error={errors?.email}
          />
          <EditText
            className="mt-3"
            htmlFor="password"
            type="password"
            label={t('PASSWORD') as string}
            value=""
            error={errors?.password}
          />
          {action === 'register' && (
            <>
              {/* Display Name */}
              <EditText
                className="mt-3"
                htmlFor="displayName"
                label={t('DISPLAY_NAME') as string}
                value=""
                error={errors?.displayName}
              />
            </>
          )}
          <div className="w-full text-center mt-4">
            <button
              type="submit"
              name="_action"
              value={action}
              className="
                text-white dark:text-black
                bg-black dark:bg-white
                w-full rounded
                hover:opacity-50 hover:-translate-y-1
                p-4  mt-2 px-3 py-3 text-blue-600 font-semibold transition duration-300 ease-in-out
              "
            >
              {(action === 'sign-in' ? t('SIGN_IN') : t('SIGN_UP')) as string}
            </button>
          </div>
          <div className="w-full text-center mt-6 mb-6">
            <p className=" text-opacity-60 text-center text-black dark:text-white ">
              {t('INQUIRY') as string}
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
