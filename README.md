<a name="readme-top"></a>

# Full-stack Jira Clone using Next.js 14 and Appwrite

![Full-stack Jira Clone using Next.js 14 and Appwrite](/.github/images/img_main.png 'Full-stack Jira Clone using Next.js 14 and Appwrite')

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy 'Ask Me Anything!')
[![GitHub license](https://flat.badgen.net/github/license/sanidhyy/jira-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/blob/main/LICENSE 'GitHub license')
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/commits/main 'Maintenance')
[![GitHub branches](https://flat.badgen.net/github/branches/sanidhyy/jira-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/branches 'GitHub branches')
[![Github commits](https://flat.badgen.net/github/commits/sanidhyy/jira-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/commits 'Github commits')
[![GitHub issues](https://flat.badgen.net/github/issues/sanidhyy/jira-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/issues 'GitHub issues')
[![GitHub pull requests](https://flat.badgen.net/github/prs/sanidhyy/jira-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/jira-clone/pulls 'GitHub pull requests')
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://clone-jira.vercel.app 'Vercel status')

<!-- Table of Contents -->
<details>

<summary>

# :notebook_with_decorative_cover: Table of Contents

</summary>

- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
- [Stats](#wrench-stats)
- [Contribute](#raised_hands-contribute)
- [Acknowledgements](#gem-acknowledgements)
- [Buy Me a Coffee](#coffee-buy-me-a-coffee)
- [Follow Me](#rocket-follow-me)
- [Learn More](#books-learn-more)
- [Deploy on Vercel](#page_with_curl-deploy-on-vercel)
- [Give A Star](#star-give-a-star)
- [Star History](#star2-star-history)
- [Give A Star](#star-give-a-star)

</details>

## :bangbang: Folder Structure

Here is the folder structure of this app.

```bash
jira-clone/
  |- public/
    |-- github.svg
    |-- icon.svg
  |- src/
    |-- app/
        |--- (auth)/
        |--- (dashboard)/
        |--- (standalone)/
        |--- api/[[...route]]/
        |--- apple-icon.png
        |--- error.tsx
        |--- favicon.ico
        |--- globals.css
        |--- icon1.png
        |--- icon2.png
        |--- layout.tsx
        |--- not-found.tsx
    |-- components/
        |--- ui/
        |--- analytics-card.tsx
        |--- analytics.tsx
        |--- date-picker.tsx
        |--- dotted-separator.tsx
        |--- logo.tsx
        |--- mobile-sidebar.tsx
        |--- modal-provider.tsx
        |--- navbar.tsx
        |--- navigation.tsx
        |--- page-error.tsx
        |--- page-loader.tsx
        |--- projects.tsx
        |--- query-provider.tsx
        |--- responsive-modal.tsx
        |--- sidebar.tsx
        |--- source-code.tsx
        |--- workspace-switcher.tsx
    |-- config/
        |--- db.ts
        |--- index.ts
    |-- features/
        |--- auth/
        |--- members/
        |--- projects/
        |--- tasks/
        |--- workspaces/
    |-- hooks/
        |--- use-confirm.tsx
        |--- use-debounce.ts
    |-- lib/
        |--- appwrite.ts
        |--- hono.ts
        |--- oauth.ts
        |--- session-middleware.ts
        |--- utils.ts
  |- .env.example
  |- .env.local
  |- .eslintrc.json
  |- .gitignore
  |- .prettierrc.json
  |- .prettierrc.mjs
  |- bun.lockb
  |- components.json
  |- environment.d.ts
  |- next.config.mjs
  |- package.json
  |- postcss.config.js
  |- README.md
  |- tailwind.config.ts
  |- tsconfig.json
```

<br />

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env.local` file in **root** directory.
4. Contents of `.env.local`:

```env
# disable next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# app base url
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# appwrite project and key
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=XXXXXXXXXXXXXXXXXXX
NEXT_APPWRITE_KEY=standard_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# appwrite database ids
NEXT_PUBLIC_APPWRITE_DATABASE_ID=XXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=XXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=XXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APPWRITE_TASKS_ID=XXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=XXXXXXXXXXXXXXXXXXX

```

### 5. Disable Next.js Telemetry

Set `NEXT_TELEMETRY_DISABLED` to `1`. This disables Next.js telemetry (optional).

### 6. App Base URL

Set the `NEXT_PUBLIC_APP_BASE_URL` to `http://localhost:3000` where your app will be running locally or in production.

### 7. Get Appwrite Endpoint and Project ID

1. Create an account on **[Appwrite](https://appwrite.io/)**.
2. **Create a new project**:
   - Go to **Dashboard** > **Create Project**.
3. Retrieve your **Appwrite Endpoint** and **Project ID**:
   - Navigate to **Settings** > **Overview** > **API Credentials**.
   - Copy the **Endpoint** and **Project ID**, and save them in `.env.local` as `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT`.

---

### 8. Generate Appwrite API Key

1. Go to the **Overview** tab.
2. Navigate to **Integrations** > **API Keys** > **Create API Key**:
   - Name: `jira-clone-web` (or any preferred name).
   - Expiration Time: **Never**.
   - Scopes:
     - `auth`
     - `session.write`
     - `users.read`.
3. Copy the generated API key and save it in `.env.local` as `NEXT_APPWRITE_KEY`.

---

### 9. Create Database and Collections

#### Create the Database

1. Go to the **Databases** tab.
2. Create a new database named `jira-clone`.
3. Copy the **Database ID** (displayed near the database name) and save it in `.env.local` as `NEXT_PUBLIC_APPWRITE_DATABASE_ID`.

---

#### Create Collections and Define Attributes

1. **Tasks** Collection:

- Attributes:
  - `workspaceId` (String, Required, Size: 50)
  - `name` (String, Required, Size: 256)
  - `projectId` (String, Required, Size: 50)
  - `assigneeId` (String, Required, Size: 50)
  - `description` (String, Optional, Size: 2048)
  - `dueDate` (DateTime, Required)
  - `status` (Enum, Required)
    - Elements: BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE
  - `position` (Integer, Required, Min: 1000, Max: 1000000)

2. **Projects** Collection:

- Attributes:
  - `workspaceId` (String, Required, Size: 50)
  - `imageId` (String, Optional, Size: 50)
  - `name` (String, Required, Size: 256)

3. **Members** Collection:

- Attributes:
  - `userId` (String, Required, Size: 50)
  - `workspaceId` (String, Required, Size: 50)
  - `role` (Enum, Required)
    - Elements: ADMIN, MEMBER

4. **Workspaces** Collection:

- Attributes:
  - `name` (String, Required, Size: 256)
  - `userId` (String, Required, Size: 50)
  - `imageId` (String, Optional, Size: 50)
  - `inviteCode` (String, Required, Size: 10)

#### Set Permissions for Collections

For each collection:

1. Navigate to **Settings** > **Permissions**.
2. Add the role **All Users** with **Create**, **Read**, **Update**, and **Delete** permissions and click Update.

3. Copy the **Collection IDs** (displayed near collection names) for each collection and save them in `.env.local` as `NEXT_PUBLIC_APPWRITE_MEMBERS_ID`, `NEXT_PUBLIC_APPWRITE_PROJECTS_ID`, `NEXT_PUBLIC_APPWRITE_TASKS_ID`, and `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`.

---

### 10. Add Index to the Tasks Collection

1. Go to the **Tasks** collection.
2. Navigate to the **Indexes** tab.
3. Create a new index:
   - Name: `task_name`.
   - Type: **Full Text**.
   - Attribute: **name**.
   - Order: **DESC**.

---

### 11. Create a Bucket for Images

1. Go to the **Storage** tab.
2. Create a new bucket named `images` (or any preferred name).
3. Configure bucket settings:
   - **Permissions**: Add the role **All Users** with **Create**, **Read**, **Update**, and **Delete** permissions.
   - **Maximum File Size**: Set to **1 MB**.
   - **Allowed File Extensions**: Add `jpg`, `png`, and `jpeg`.
   - Save the settings.
4. Copy the **Bucket ID** (displayed near the bucket name) and save it in `.env.local` as `NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID`.

---

## 12. Configure OAuth with Google

1. Go to the **Auth** tab in Appwrite > **Settings**.
2. Enable **Google** and copy the provided **Redirect URI**.
3. Visit the [Google Cloud Console](https://console.cloud.google.com):
   - **Create a new project** and configure the **OAuth consent screen** with default settings.
4. Create **OAuth 2.0 credentials**:
   - Add the copied **Redirect URI** from Appwrite as the **Authorized Redirect URI**.
5. After creation, copy the generated **Client ID** and **Client Secret**.
6. Return to Appwrite and paste the **Client ID** and **Client Secret** into the corresponding fields for **App ID** and **App Secret**, then click **Update**.

---

## 13. Configure OAuth with GitHub

1. Go to the **Auth** tab in Appwrite > **Settings**.
2. Enable **GitHub** and copy the provided **Redirect URI**.
3. Visit the [GitHub Developer Settings](https://github.com/settings/developers):
   - Under **OAuth Apps**, click **New OAuth App**.
4. Fill out the required fields:
   - **Application Name**: `Jira Clone` (or any preferred name).
   - **Homepage URL**: `http://localhost:3000` (or your app's base URL).
   - **Authorization Callback URL**: Paste the **Redirect URI** copied from Appwrite.
5. Click **Register Application**.
6. After registration, you'll receive a **Client ID** and **Client Secret**.
7. Return to Appwrite and paste the **Client ID** and **Client Secret** into the corresponding fields for **App ID** and **App Secret**, then click **Update**.

---

14. Install Project Dependencies using `npm install --legacy-peer-deps` or `yarn install --legacy-peer-deps` or `bun install --legacy-peer-deps`.

15. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev` or `bun dev`.

**NOTE:** Please make sure to keep your API keys and configuration values secure and do not expose them publicly.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png 'Modern UI/UX')

![Tasks Kanban View](/.github/images/img2.png 'Tasks Kanban View')

![Tasks Calendar View](/.github/images/img3.png 'Tasks Calendar View')

![Responsive Modals](/.github/images/img4.png 'Responsive Modals')

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react 'React JS')](https://react.dev/ 'React JS') [![Next JS](https://skillicons.dev/icons?i=next 'Next JS')](https://nextjs.org/ 'Next JS') [![Typescript](https://skillicons.dev/icons?i=ts 'Typescript')](https://www.typescriptlang.org/ 'Typescript') [![Appwrite](https://skillicons.dev/icons?i=appwrite 'Appwrite')](https://www.appwrite.io/ 'Appwrite') [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind 'Tailwind CSS')](https://tailwindcss.com/ 'Tailwind CSS') [![Vercel](https://skillicons.dev/icons?i=vercel 'Vercel')](https://vercel.app/ 'Vercel')

## :wrench: Stats

[![Stats for Jira Clone](/.github/images/stats.svg 'Stats for Jira Clone')](https://pagespeed.web.dev/analysis?url=https://clone-jira.vercel.app/ 'Stats for Jira Clone')

## :raised_hands: Contribute

You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies that are used in Jira Clone.

- Thanks to CodeWithAntonio: https://codewithantonio.com/
- [@hello-pangea/dnd](https://www.npmjs.com/package/@hello-pangea/dnd): ^17.0.0
- [@hono/zod-validator](https://www.npmjs.com/package/@hono/zod-validator): ^0.4.1
- [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers): ^3.9.0
- [@radix-ui/react-avatar](https://www.npmjs.com/package/@radix-ui/react-avatar): ^1.1.1
- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog): ^1.1.2
- [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu): ^2.1.2
- [@radix-ui/react-icons](https://www.npmjs.com/package/@radix-ui/react-icons): ^1.3.0
- [@radix-ui/react-label](https://www.npmjs.com/package/@radix-ui/react-label): ^2.1.0
- [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover): ^1.1.2
- [@radix-ui/react-scroll-area](https://www.npmjs.com/package/@radix-ui/react-scroll-area): ^1.2.0
- [@radix-ui/react-select](https://www.npmjs.com/package/@radix-ui/react-select): ^2.1.2
- [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator): ^1.1.0
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot): ^1.1.0
- [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs): ^1.1.1
- [@radix-ui/react-visually-hidden](https://www.npmjs.com/package/@radix-ui/react-visually-hidden): ^1.1.0
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query): ^5.59.16
- [@tanstack/react-table](https://www.npmjs.com/package/@tanstack/react-table): ^8.20.5
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority): ^0.7.0
- [clsx](https://www.npmjs.com/package/clsx): ^2.1.1
- [date-fns](https://www.npmjs.com/package/date-fns): ^4.1.0
- [hono](https://www.npmjs.com/package/hono): ^4.6.7
- [lucide-react](https://www.npmjs.com/package/lucide-react): ^0.453.0
- [next](https://www.npmjs.com/package/next): 14.2.15
- [next-themes](https://www.npmjs.com/package/next-themes): ^0.3.0
- [node-appwrite](https://www.npmjs.com/package/node-appwrite): ^14.1.0
- [nuqs](https://www.npmjs.com/package/nuqs): 1.19.1
- [react](https://www.npmjs.com/package/react): ^18
- [react-big-calendar](https://www.npmjs.com/package/react-big-calendar): ^1.15.0
- [react-day-picker](https://www.npmjs.com/package/react-day-picker): 8.10.1
- [react-dom](https://www.npmjs.com/package/react-dom): ^18
- [react-hook-form](https://www.npmjs.com/package/react-hook-form): ^7.53.1
- [react-icons](https://www.npmjs.com/package/react-icons): ^5.3.0
- [react-use](https://www.npmjs.com/package/react-use): ^17.5.1
- [server-only](https://www.npmjs.com/package/server-only): ^0.0.1
- [sonner](https://www.npmjs.com/package/sonner): ^1.5.0
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge): ^2.5.4
- [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate): ^1.0.7
- [vaul](https://www.npmjs.com/package/vaul): ^1.1.0
- [zod](https://www.npmjs.com/package/zod): ^3.23.8
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser): ^7.25.9
- [@trivago/prettier-plugin-sort-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports): ^4.3.0
- [@types/node](https://www.npmjs.com/package/@types/node): ^20
- [@types/react](https://www.npmjs.com/package/@types/react): ^18
- [@types/react-big-calendar](https://www.npmjs.com/package/@types/react-big-calendar): ^1.15.0
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): ^18
- [eslint](https://www.npmjs.com/package/eslint): ^8
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next): 14.2.15
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): ^9.1.0
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier): ^5.2.1
- [postcss](https://www.npmjs.com/package/postcss): ^8
- [prettier](https://www.npmjs.com/package/prettier): ^3.3.3
- [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss): ^0.6.8
- [tailwindcss](https://www.npmjs.com/package/tailwindcss): ^3.4.1
- [tidy-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports): npm:@trivago/prettier-plugin-sort-imports
- [sort-classes](https://www.npmjs.com/package/prettier-plugin-tailwindcss): npm:prettier-plugin-tailwindcss
- [typescript](https://www.npmjs.com/package/typescript): ^5

## :coffee: Buy Me a Coffee

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://www.buymeacoffee.com/sanidhy 'Buy me a Coffee')

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/sanidhyy?style=social&label=Follow&maxAge=2592000)](https://github.com/sanidhyy 'Follow Me')
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FTechnicalShubam)](https://twitter.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2Fsanidhyy%2Fjira-clone 'Tweet about this project')
[![Subscribe to my YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCNAz_hUVBG2ZUN8TVm0bmYw)](https://www.youtube.com/@OPGAMER./?sub_confirmation=1 'Subscribe to my YouTube Channel')

## :books: Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## :page_with_curl: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## :star2: Star History

<a href="https://star-history.com/#sanidhyy/jira-clone&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sanidhyy/jira-clone&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sanidhyy/jira-clone&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sanidhyy/jira-clone&type=Timeline" />
</picture>
</a>

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>
