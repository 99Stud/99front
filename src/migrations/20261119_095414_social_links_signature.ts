import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`social_links_links\` ADD \`show_in_signature\` integer DEFAULT false;`)
  // Hand-written: the signature used to hard-code these two, keep them on for already saved links
  await db.run(sql`UPDATE \`social_links_links\` SET \`show_in_signature\` = true WHERE \`label\` IN ('Instagram', 'LinkedIn');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`social_links_links\` DROP COLUMN \`show_in_signature\`;`)
}
