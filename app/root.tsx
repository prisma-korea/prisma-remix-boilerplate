import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type {LinksFunction, MetaFunction} from '@remix-run/node';

import styles from './styles/app.css';
import {useEffect} from 'react';

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css'},
    {rel: 'stylesheet', href: styles}
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid
    // if (
    //   localStorage.theme === 'dark' ||
    //   (!('theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches)
    // ) {
    //   console.log('is dark');
    //   document.documentElement.classList.add('dark');
    // } else {
    //   console.log('is light');
    //   document.documentElement.classList.remove('dark');
    // }

    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = 'light'

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = 'dark'

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme')
  }, []);

  return (
    <html lang="en">
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
