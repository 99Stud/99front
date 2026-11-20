# 99Front

The public website of the 99stud creative collective: a WebGL home page, plus a Payload CMS admin the team uses to edit site content and generate its email signature.

Seeded from the code as it stood in November 2026. `/grill-with-docs` sharpens it: challenge any term that reads wrong.

## Language

### Site content

**Social links**:
The ordered list of labelled `https` links the team manages in the CMS. The home page shows all of them; the email signature shows the picked ones.
_Avoid_: socials, networks, footer links

**Site SEO**:
The CMS-managed title, description and share image that indexable pages fall back to.
_Avoid_: meta settings, SEO config

**Share image**:
The image shown when a page is linked on a social network or in a chat app.
_Avoid_: OG image, social card, thumbnail

**Post**:
An article written in the CMS, either a draft or published. Visitors only ever see published posts.
_Avoid_: article, blog entry, news

**Policy**:
A legal page written in the CMS (legal notice, privacy policy…), served at `/<slug>` once published. The legal notice is the one policy with built-in defaults.
_Avoid_: legal page, terms page, CMS page

**Reserved slug**:
A slug a policy cannot take, because that address already belongs to the admin, the API or a static folder.
_Avoid_: forbidden slug, blacklisted slug

**Linkable collection**:
A CMS collection whose documents have a public page, so rich text can link to them.
_Avoid_: routable collection, public collection

**Rich text**:
Formatted content written in the CMS editor (headings, lists, links), as used by policies and posts.
_Avoid_: WYSIWYG, HTML content, body

**Built-in defaults**:
The values compiled into the site that a public page shows when the CMS field is empty or the database cannot be read.
_Avoid_: hardcoded values, placeholders

### Email signature

**Email signature**:
The block a team member pastes into their mail app: logo, their name, the collective's tagline, and links.
_Avoid_: mail footer, sign-off

**Signature tool**:
The admin page (`/admin/signature`) where a logged-in team member types their name, picks the signature links and copies the email signature.
_Avoid_: signature generator, brand page

**Signature link**:
A social link picked to appear in the email signature. The pick is shared by the whole team.
_Avoid_: selected link, signature social

### Deployment

**Preview**:
The deployment of a pull request branch. Every preview runs on the preview data, never on production content.
_Avoid_: staging, branch deploy

**Preview data**:
The one database and one media bucket shared by all previews.
_Avoid_: staging database, test data

### WebGL scene

**Scene**:
The full-screen WebGL composition behind the home page.
_Avoid_: canvas, 3D background, experience

**Entity**:
One visible object of the scene, owning its mesh, materials and per-frame update.
_Avoid_: object, element, actor

**Coin**:
The entity at the centre of the scene: a metal coin the visitor drags and flips.
_Avoid_: token, medal, logo mesh

**Recto / Verso**:
The two faces of the coin.
_Avoid_: front/back, heads/tails

**Tick**:
One frame of the scene's clock. Every animation advances on the tick.
_Avoid_: frame callback, rAF, update loop

**Manifest**:
The list of every asset the scene needs, loaded in full before the scene starts.
_Avoid_: asset list, preload list
