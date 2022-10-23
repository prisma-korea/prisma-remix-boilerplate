import {I18nextProvider, initReactI18next} from "react-i18next";

import Backend from "i18next-fs-backend";
import type {EntryContext} from "@remix-run/node";
import {PassThrough} from "stream";
import {RemixServer} from "@remix-run/react";
import {Response} from "@remix-run/node";
import {createInstance} from "i18next";
import {i18nConfig} from "./i18n";
import {remixI18n} from "./services/i18n.server";
import {renderToPipeableStream} from "react-dom/server";
import {renderToString} from "react-dom/server";
import {resolve} from "node:path";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
    // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const instance = createInstance();

  // Then we could detect locale from the request
  const lng = await remixI18n.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = remixI18n.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18nConfig,
      react: {useSuspense: false},
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render want to use
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });
    

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  let markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  return new Promise((resolve, reject) => {
    let didError = false;

    const {pipe, abort} = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response("<!DOCTYPE html>" + markup, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
