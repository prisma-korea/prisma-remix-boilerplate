import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {prisma} from '~/utils/prisma.server';
import {remixI18n} from '../services/i18n.server';
import {requireUserId} from '../utils/auth.server';
import {useLoaderData} from '@remix-run/react';
import {useTranslation} from 'react-i18next';

export const loader: LoaderFunction = async ({request}) => {
  const userId = await requireUserId(request);

  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  const locale = await remixI18n.getLocale(request);
  const t = await remixI18n.getFixedT(request);
  const title = t('TITLE');

  return json({locale, title, user});
};

export default function Index() {
  const data = useLoaderData();
  const {t} = useTranslation();

  console.log('data', data);

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
        {t('TITLE') as string}
      </h2>
      <button
        type="button"
        value={t('SIGN_OUT') as string}
        className="
          text-white dark:text-black
          bg-black dark:bg-white
          rounded
          hover:opacity-50 hover:-translate-y-1
          p-4  mt-8 px-8 py-3 text-blue-600 font-semibold transition duration-300 ease-in-out
        "
      >
        {t('SIGN_OUT') as string}
      </button>
    </div>
  );
}
