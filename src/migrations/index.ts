import * as migration_20261118_162246_initial from './20261118_162246_initial';
import * as migration_20261118_171019_social_links from './20261118_171019_social_links';
import * as migration_20261119_095414_social_links_signature from './20261119_095414_social_links_signature';

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
    up: migration_20261119_095414_social_links_signature.up,
    down: migration_20261119_095414_social_links_signature.down,
    name: '20261119_095414_social_links_signature'
  },
];
