import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {prisma} from '~/utils/prisma.server';
import {remixI18n} from '../services/i18n.server';
import {requireUserId} from '../utils/auth.server';
import {useLoaderData} from '@remix-run/react';

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
  console.log('data', data);

  return (
    <div
      className="
        bg-white dark:bg-slate-800
        flex h-screen justify-center items-center
      "
    >
      <h2
        className="
          text-black dark:text-white text-5xl
        "
      >
        TailwindCSS Is Working!
      </h2>
    </div>
  );
}
