import type {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import {useCallback, useEffect, useState} from 'react';

import type {CatchBoundaryComponent} from '@remix-run/react/dist/routeModules';
import type {ReactElement} from 'react';
import {json} from '@remix-run/node';
import {remixI18n} from './services/i18n.server';
import styles from './styles/app.css';
import {useTranslation} from 'react-i18next';

type LoaderData = {locale: string};

export const loader: LoaderFunction = async ({request}) => {
  const locale = await remixI18n.getLocale(request);

  return json<LoaderData>({locale});
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css'},
    {rel: 'stylesheet', href: styles},
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Boilerplate',
  viewport: 'width=device-width,initial-scale=1',
});

function Document({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}): ReactElement {
  type Brightness = 'light' | 'dark';

  const [brightness, setBrightness] = useState<Brightness | null>();

  const toggleTheme = useCallback((brightness: Brightness) => {
    document.documentElement.classList.add(brightness);
    localStorage.theme = brightness;
    setBrightness(brightness);
  }, []);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      toggleTheme('dark');

      return;
    }

    toggleTheme('light');

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  }, [toggleTheme]);

  useEffect(() => {
    (() => {
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === '.') {
          toggleTheme(brightness === 'light' ? 'dark' : 'light');
        }
      });
    })();

    return () => {
      document.removeEventListener('keydown', () => {});
    };
  }, [brightness, toggleTheme]);

  const {i18n} = useTranslation();

  return (
    <html lang={i18n.language} className={brightness || 'light'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-slate-800">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function App(): ReactElement {
  return (
    <Document title="Remix boilerplate">
      <Outlet />
    </Document>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('error', error);
  }

  return (
    <Document title="An Error occurred">
      <div>
        <h1>
          {error.stack} {error.message}
        </h1>
      </div>
    </Document>
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>
    </Document>
  );
};
