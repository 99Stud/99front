import * as migration_20261118_162246_initial from './20261118_162246_initial';
import * as migration_20261118_171019_social_links from './20261118_171019_social_links';
import * as migration_20261119_092405_site_seo from './20261119_092405_site_seo';
import * as migration_20261119_095414_social_links_signature from './20261119_095414_social_links_signature';
import * as migration_20261120_145040_policies from './20261120_145040_policies';
import * as migration_20261120_154950_social_links_home from './20261120_154950_social_links_home';

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
  {
    up: migration_20261119_095414_social_links_signature.up,
    down: migration_20261119_095414_social_links_signature.down,
    name: '20261119_095414_social_links_signature',
  },
  {
    up: migration_20261120_145040_policies.up,
    down: migration_20261120_145040_policies.down,
    name: '20261120_145040_policies',
  },
  {
    up: migration_20261120_154950_social_links_home.up,
    down: migration_20261120_154950_social_links_home.down,
    name: '20261120_154950_social_links_home',
  },
];
