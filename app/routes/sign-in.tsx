import type {ActionFunction, LoaderFunction} from '@remix-run/node';
import {getUser, register, signIn} from '~/utils/auth.server';
import {json, redirect} from '@remix-run/node';
import {useEffect, useRef, useState} from 'react';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '~/utils/validators.server';

import {FormField} from '~/components/form-field';
import {remixI18n} from '~/services/i18n.server';
import {useActionData} from '@remix-run/react';
import {useTranslation} from 'react-i18next';

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request);
  const locale = await remixI18n.getLocale(request);
  const t = await remixI18n.getFixedT(request);
  const title = t('sign_in');

  return user ? redirect('/') : json({locale, title});
};

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData();
  const action = form.get('_action');
  const email = form.get('email');
  const password = form.get('password');
  let firstName = form.get('firstName');
  let lastName = form.get('lastName');

  if (
    typeof action !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return json({error: `Invalid Form Data`, form: action}, {status: 400});
  }

  if (
    action === 'register' &&
    (typeof firstName !== 'string' || typeof lastName !== 'string')
  ) {
    return json({error: `Invalid Form Data`, form: action}, {status: 400});
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === 'register'
      ? {
          firstName: validateName((firstName as string) || ''),
          lastName: validateName((lastName as string) || ''),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {errors, fields: {email, password, firstName, lastName}, form: action},
      {status: 400},
    );

  switch (action) {
    case 'sign-in': {
      return await signIn({email, password});
    }
    case 'register': {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({email, password, firstName, lastName});
    }
    default:
      return json({error: `Invalid Form Data`}, {status: 400});
  }
};

export default function SignIn() {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || '');
  const [action, setAction] = useState('sign-in');
  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
    displayName: actionData?.fields?.lastName || '',
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: '',
        password: '',
        displayName: '',
      };

      setErrors(newState);
      setFormError('');
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError('');
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({...form, [field]: event.target.value}));
  };

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
          {(action === 'sign-in' ? t('sign_in') : t('sign_up')) as string}
        </button>
        <form
          method="POST"
          className="px-8 py-16 w-96 border-transparent border-2 rounded shadow-xl"
        >
          <div className="text-xs text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          <h2
            className="
            text-5xl mb-2
            text-center
            text-black dark:text-white
          "
          >
            {(action === 'sign-in' ? t('sign_in') : t('sign_up')) as string}
          </h2>
          <p
            className="
            text-opacity-60 mb-12
            text-center
            text-black dark:text-white
          "
          >
            {
              (action === 'sign-in'
                ? t('sign_in_desc')
                : t('sign_up_desc')) as string
            }
          </p>
          <FormField
            htmlFor="email"
            label={t('email') as string}
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            error={errors?.email}
          />
          <FormField
            className="mt-3"
            htmlFor="password"
            type="password"
            label={t('password') as string}
            value={formData.password}
            onChange={(e) => handleInputChange(e, 'password')}
            error={errors?.password}
          />
          {action === 'register' && (
            <>
              {/* Display Name */}
              <FormField
                className="mt-3"
                htmlFor="displayName"
                label={t('display_name') as string}
                onChange={(e) => handleInputChange(e, 'displayName')}
                value={formData.displayName}
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
              {(action === 'sign-in' ? t('sign_in') : t('sign_up')) as string}
            </button>
          </div>
          <div className="w-full text-center mt-6 mb-6">
            <p className=" text-opacity-60 text-center text-black dark:text-white ">
              {t('inquiry') as string}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
