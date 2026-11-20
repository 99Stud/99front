import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Hand-written: builders that keep the Lexical JSON of the legal notice seeded below readable.
// Kept inside the migration, which must not depend on application code that can change later.
const text = (value: string) => ({
  type: 'text', version: 1, text: value, format: 0, detail: 0, mode: 'normal', style: '',
})
const elementNode = (type: string, children: object[], extra: object = {}) => ({
  type, version: 1, children, direction: 'ltr', format: '', indent: 0, ...extra,
})
const heading = (value: string) => elementNode('heading', [text(value)], { tag: 'h2' })
const paragraph = (value: string) =>
  elementNode('paragraph', [text(value)], { textFormat: 0, textStyle: '' })
const bulletList = (items: string[]) =>
  elementNode(
    'list',
    items.map((item, index) => elementNode('listitem', [text(item)], { value: index + 1 })),
    { listType: 'bullet', start: 1, tag: 'ul' },
  )

const LEGAL_NOTICE_CONTENT = {
  root: elementNode('root', [
    heading('Publisher'),
    paragraph(
      'WEARESTUDIO99, non-profit organisation (under the 1901 law), domiciled at 8 rue Santos Dumont, Lyon 69008, France, registered under no. 924529076',
    ),
    heading('Publication directors'),
    bulletList(['Mr. Thibault Walterspieler, president', 'Mr. Roman Verne, vice-president']),
    heading('Hosting'),
    paragraph('Cloudflare, Inc. 101 Townsend St, San Francisco, CA 94107, USA'),
  ]),
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`policies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`policies_slug_idx\` ON \`policies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`policies_updated_at_idx\` ON \`policies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`policies_created_at_idx\` ON \`policies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`policies__status_idx\` ON \`policies\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_parent_idx\` ON \`_policies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_slug_idx\` ON \`_policies_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_updated_at_idx\` ON \`_policies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_created_at_idx\` ON \`_policies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version__status_idx\` ON \`_policies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_created_at_idx\` ON \`_policies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_updated_at_idx\` ON \`_policies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_latest_idx\` ON \`_policies_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`policies_id\` integer REFERENCES policies(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_policies_id_idx\` ON \`payload_locked_documents_rels\` (\`policies_id\`);`)
  // Hand-written: the legal notice used to be hard-coded in the page, carry its text over.
  // Plain SQL, so that this migration keeps working on a fresh database once the collection has
  // gained fields. Drafts read the versions table, hence the second row.
  await db.run(sql`INSERT INTO \`policies\` (\`title\`, \`generate_slug\`, \`slug\`, \`content\`, \`_status\`) VALUES ('Legal Notice', false, 'legal-notice', ${JSON.stringify(LEGAL_NOTICE_CONTENT)}, 'published');`)
  await db.run(sql`INSERT INTO \`_policies_v\` (\`parent_id\`, \`version_title\`, \`version_generate_slug\`, \`version_slug\`, \`version_content\`, \`version_updated_at\`, \`version_created_at\`, \`version__status\`, \`latest\`) SELECT \`id\`, \`title\`, \`generate_slug\`, \`slug\`, \`content\`, \`updated_at\`, \`created_at\`, \`_status\`, true FROM \`policies\` WHERE \`slug\` = 'legal-notice';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`policies\`;`)
  await db.run(sql`DROP TABLE \`_policies_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`posts_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "posts_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "posts_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}
