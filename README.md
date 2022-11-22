# prisma-remix-boilerplate

[![CI](https://github.com/prisma-korea/prisma-remix-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/prisma-remix-boilerplate/actions/workflows/ci.yml)

## Introduction

`prisma-remix-boilerplate` is the production ready boilerplate for those who are interested in [Remix](https://remix.run/) & [Prisma](https://www.prisma.io/)!

> Specification

- [remix](https://remix.run/)
- [prisma](https://www.prisma.io/)
- [tailwindcss](https://tailwindcss.com/)
- [react-i18n](https://react.i18next.com/)
- [typescript](https://www.typescriptlang.org/)

---

## Install

```sh
yarn && yarn dev
// or
npm install && npm run dev

```

---

## Env

Run below script to make your own `app` env variables.

> `cp .env.sample .env`

- `env` variables
  | Name | required | description |
  | ------------------- |--------- | ----------------------- |
  | SESSION_SECRET | | For session cookie secrets |
  | DATABASE_URL | yes | To initiate prisma client |

---

## Localization

We've defined strings in `public/locales/*.json`.
We use [react-i18n](https://react.i18next.com/) package for localization.

---

## Folder structure

```
├── .github/ - CI config files
├── @types/  - Library type extends files
├── app/ - Main business logic
│   ├── components/ - UI Components
│   └── routes/ - Route components
│       └── __views/ - Presentational components
│           └── index.tsx
│       └── actions/ - Handle form request route
│       └── actions/ - Handle external request route
│   └── services/ - Data CRUD functions
│   └── styles/ - tailwind css file
│   └── types/ - Shared type files
│   └── utils/ - Shared business logic files
│   └── entry.client.tsx - client entry file
│   └── entry.server.tsx - server entry file
│   └── root.tsx - Main entry file
│   └── i18n.ts - i18n config
├── prisma/ - prisma schema
├── styles/ - for postcss processor
├── .env.sample - env sample
├── eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc.js
├── CONTRIBUTING.md
├── package.json
├── postcss.config.js
├── README.md
├── remix.config.js
├── remix.env.d.ts
├── tailwindcss.config.js
├── tsconfig.json
└── yarn.lock
```

### components/

UI components are in `app/components` folder.

### routes/

route component are in `app/routes` folder.

- Presentational routes : Presentational routes are in `app/routes/__views` folder. You can place the view(page) components here, then the component path will be url without `__views`.

  ```js
  // __views are not included in url
  /app/routers/__views/sign-in.tsx => /sign-in
  ```

- Action routes : Action routes are in `app/routes/actions` folder. Action routes can handle form request from the other presentational routes. They should not contain any code related to view.

- Resources routes : Resources routes are in `app/routes/resources` folder. Resources routes can handle a request from external end point. You can think of this like a server API.

### services/

Service functions have responsibility for data CRUD. They should run on server and handle request from client.

### Utils/

Utils folder is for utility codes. They can be used for both client or server side. When you think that the logic is not belongs to any specific domain, Place it to utils folder.

---

## Contribution guides

- See also
  - dooboolab's [vision-and-mission](https://dooboolab.com/vision_and_mission)
  - dooboolab's [code of conduct](https://dooboolab.com/code_of_conduct)
- [Contributing](CONTRIBUTING.md)
