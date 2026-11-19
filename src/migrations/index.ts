import * as migration_20261118_162246_initial from './20261118_162246_initial';
import * as migration_20261118_171019_social_links from './20261118_171019_social_links';
import * as migration_20261119_092405_site_seo from './20261119_092405_site_seo';

export const migrations = [
  {
    up: migration_20261118_162246_initial.up,
    down: migration_20261118_162246_initial.down,
    name: '20261118_162246_initial',
  },
  {
    up: migration_20261118_171019_social_links.up,
    down: migration_20261118_171019_social_links.down,
    name: '20261118_171019_social_links',
  },
  {
    up: migration_20261119_092405_site_seo.up,
    down: migration_20261119_092405_site_seo.down,
    name: '20261119_092405_site_seo',
  },
];
