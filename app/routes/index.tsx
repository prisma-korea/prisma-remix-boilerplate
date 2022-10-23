import type {LoaderFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {remixI18n} from '../services/i18n.server';
import {requireUserId} from '../utils/auth.server';

export const loader: LoaderFunction = async ({request}) => {
  await requireUserId(request);

  const locale = await remixI18n.getLocale(request);
  const t = await remixI18n.getFixedT(request, 'common');
  const title = t('TITLE');
  return json({locale, title});
};

export default function Index() {
  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <h2 className="text-blue-600 text-5xl">TailwindCSS Is Working!</h2>
    </div>
  );
}
