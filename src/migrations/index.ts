import * as migration_20261118_162246_initial from './20261118_162246_initial';
import * as migration_20261118_171019_social_links from './20261118_171019_social_links';

export const migrations = [
  {
    up: migration_20261118_162246_initial.up,
    down: migration_20261118_162246_initial.down,
    name: '20261118_162246_initial',
  },
  {
    up: migration_20261118_171019_social_links.up,
    down: migration_20261118_171019_social_links.down,
    name: '20261118_171019_social_links'
  },
];
