import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import {useCallback, useEffect, useState} from 'react';

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

export default function App() {
  type Brightness = 'light' | 'dark';
  const [brightness, setBrightness] = useState<Brightness>('light');

  const toggleTheme = useCallback((brightness: Brightness) => {
    if (brightness === 'light') {
      document.documentElement.classList.add('light');
      localStorage.theme = 'light';
      setBrightness('light');
      return;
    }

    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    setBrightness('dark');
  }, []);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      toggleTheme('light');
      return;
    }

    toggleTheme('dark');

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  }, [toggleTheme]);

  useEffect(() => {
    (() => {
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === '.') {
          setBrightness(brightness === 'light' ? 'dark' : 'light');
        }
      });
    })();

    return () => {
      document.removeEventListener('keydown', () => {});
    };
  }, [brightness]);

  const {i18n} = useTranslation();

  return (
    <html lang={i18n.language} className={brightness}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-slate-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
