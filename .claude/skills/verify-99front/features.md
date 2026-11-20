# Feature map

One section per feature area. Each answers the same four questions: what exists, how a user reaches it, how to drive it, what usually lies. For a broad regression sweep, walk the file top to bottom.

## Home page

**What exists**

- The full-screen scene behind everything: background, text tunnel, and the coin the visitor drags and flips between recto and verso.
- "Legal Notice" link, top-left.
- Social links, top-right, in CMS order, each opening in a new tab.
- "99stud creative collective" wordmark.

**How to get to it**: `/`

**Driving it**

- Wait for the scene: the manifest loads in full before the canvas appears.
- Drag across the coin; drag past the flip threshold to turn it over. Screenshot before and after.
- Resize to the mobile preset and reload: drag speed, damping and the flip threshold differ on mobile.
- Compare the social links with the "Social Links" global in the admin.
- `pnpm dev:webgl` instead of `pnpm dev` adds the debug panel and performance stats.

**Gotchas**

- The scene is client-only (`ssr: false`): page text and the accessibility tree say nothing about it. Use screenshots.
- A hidden or background tab throttles the tick; the scene looks frozen. Bring the tab to the front before judging motion.
- The page is `force-dynamic`: CMS edits show on the next reload, with no rebuild.
- If the database is unreachable the page still renders, with the built-in default links. Seeing links does not prove the CMS read worked: change one in the admin and reload.

## Legal notice

**What exists**: a page of fixed text. Its metadata is read from the CMS on each request, like the home page's.

**How to get to it**: the "Legal Notice" link on the home page, or `/legal-notice`.

**Driving it**: follow the link from the home page; check the title in `<head>` carries the page name and the site name.

**Gotchas**: none known.

## SEO metadata

**What exists**

- Title, description and share image from the "Site SEO" global, with built-in defaults for empty fields.
- A canonical link and `og:url` per indexable page.
- `robots.txt`.

**How to get to it**: the `<head>` of `/` and `/legal-notice`; `/robots.txt`.

**Driving it**

- Read `document.title` and the `meta[name=description]`, `link[rel=canonical]`, `meta[property^="og:"]` tags.
- Edit the "Site SEO" global in the admin, save, reload the public page, read the tags again.
- Clear a field and confirm the built-in default comes back.

**Gotchas**

- `og:title` is set in full by `getPageMetadata`; the layout's title template does not reach it. Check both `<title>` and `og:title`.
- Share image URLs are relative in the CMS and made absolute by `metadataBase`: the tag should carry a full URL.

## Admin: login and branding

**What exists**: the Payload admin at `/admin`, dark only, with the 99stud icon and a branded login heading.

**How to get to it**: `/admin` (logged out shows the login screen).

**Driving it**

- Logged out: screenshot the login screen.
- Log in with the local throwaway user; screenshot the dashboard and one collection list.
- Check the nav shows the "Email signature" link after the collections and globals.
- Read the `<head>` of `/admin/login`: the title ends in "- 99stud CMS", `og:image` is the absolute URL of `/brand/99stud-cms-share.png`, and no icon link points at a Payload favicon.
- Logged out, read the `<head>` of an unknown admin URL such as `/admin/nope`: same branding, title "Not Found - 99stud CMS".

**Gotchas**

- A new or moved admin component path needs `pnpm generate:importmap`; a stale import map renders nothing where the component should be, without an error on the page.
- Styling lives in `src/app/(payload)/custom.scss`, which lint ignores.

## Admin: signature tool

**What exists**

- First-name and last-name fields, with light-mode and dark-mode previews of the email signature.
- "Copy signature" (rich HTML plus plain text) and "Copy HTML" (the source), both disabled until a name is typed.
- Install steps per mail app.
- A collapsed "Links in the signature" panel: a checkbox per social link. The previews follow the ticks at once; saving makes the pick the signature links for the whole team.

**How to get to it**: the "Email signature" nav link in the admin, or `/admin/signature`.

**Driving it**

- Logged out, open `/admin/signature`: it must redirect to the login, then back to the tool after logging in.
- Type a name; both previews update and the copy buttons enable.
- Open "Links in the signature", tick and untick a link, save, reload: the pick persists. Open the "Social Links" global: labels and URLs are unchanged.
- Read the preview markup: 99stud.com first, then the picked links, in CMS order.
- Type a name containing `<b>&"`: it appears as text in the previews, not as markup.
- `/brand/signature` redirects to `/admin/signature`.

**Gotchas**

- Before the "Social Links" global is first saved, Payload hands out new row ids on every read. Test the pick on a never-saved global and on a saved one.
- The redirect lives in `next.config.ts`; a change to the view path updates it too.
- Clipboard writes can be blocked in an automated browser: the tool then shows its error toast. Judge the copied content from the preview markup in that case, and say so in the report.

## Posts and media

**What exists**: `posts` (drafts and published) and `media` (uploads, stored in R2) collections in the admin. No public page renders posts yet.

**How to get to it**: the admin collection lists.

**Driving it**

- Create a draft post with a cover image; publish it.
- Logged out, request `/api/posts`: only published posts are returned.

**Gotchas**: locally, uploads go to the R2 emulation under `.wrangler/`, so they are per checkout.
