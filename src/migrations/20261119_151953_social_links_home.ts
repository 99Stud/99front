import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`social_links_links\` ADD \`show_on_home\` integer DEFAULT true;`)
  // Hand-written: the home page used to show every link, keep them all on for already saved links
  await db.run(sql`UPDATE \`social_links_links\` SET \`show_on_home\` = true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`social_links_links\` DROP COLUMN \`show_on_home\`;`)
}
