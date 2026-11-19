import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_seo\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`site_seo_meta_meta_image_idx\` ON \`site_seo\` (\`meta_image_id\`);`,
  );
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_seo\`;`);
}
