import {Form, useLoaderData} from '@remix-run/react';

import type {LoaderFunction} from '@remix-run/node';
import type {User} from '@prisma/client';
import {json} from '@remix-run/node';
import {prisma} from '~/utils/prisma.server';
import {redirect} from '@remix-run/node';
import {remixI18n} from '../../services/i18n.server';
import {requireUserId} from '../../utils/auth.server';
import {useTranslation} from 'react-i18next';

type LoaderData = {
  user: User;
  locale: string;
  title: string;
};

export const loader: LoaderFunction = async ({request}) => {
  const userId = await requireUserId(request);

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    return redirect('/sign-in');
  }

  const locale = await remixI18n.getLocale(request);
  const t = await remixI18n.getFixedT(request);
  const title = t('TITLE');

  return json<LoaderData>({locale, title, user});
};

export default function Index() {
  const {title, user} = useLoaderData<LoaderData>();
  const {t} = useTranslation();

  return (
    <div
      className="
        bg-white dark:bg-slate-800
        flex h-screen justify-center items-center flex-col
      "
    >
      <h2
        className="
          text-black dark:text-white text-5xl
        "
      >
        {title}
      </h2>

      <div>
        <h2>Hello {user.email}</h2>
      </div>
      <Form action="/actions/logout" method="post">
        <button
          type="submit"
          value={t('SIGN_IN')}
          className="
            text-white dark:text-black
            bg-black dark:bg-white
            rounded
            hover:opacity-50 hover:-translate-y-1
            p-4  mt-8 px-8 py-3 text-blue-600 font-semibold transition duration-300 ease-in-out
          "
        >
          {t('SIGN_OUT')}
        </button>
      </Form>
    </div>
  );
}
