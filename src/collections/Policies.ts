import { slugField } from 'payload';
import { text } from 'payload/shared';

import { isReservedSlug } from '@lib/pages/Policy/reservedSlugs';

import { authenticatedOrPublished } from './access';

import type { CollectionConfig, TextField, TextFieldSingleValidation } from 'payload';

// Each policy is served at `/<slug>`, hence the reserved slugs
export const Policies: CollectionConfig = {
  slug: 'policies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      overrides: (row) => {
        const slug = row.fields.find(
          (field): field is TextField => 'name' in field && field.name === 'slug',
        );
        if (!slug) throw new Error('slugField() no longer exposes its `slug` field');
        // Field hooks run before validation, so this also sees a slug generated from the title
        const validate: TextFieldSingleValidation = (value, options) =>
          typeof value === 'string' && isReservedSlug(value)
            ? `"${value}" is already used by another part of the site.`
            : text(value, options);
        slug.validate = validate as TextField['validate'];
        return row;
      },
    }),
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
};
