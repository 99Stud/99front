import { slugField, ValidationError } from 'payload';

import { isReservedSlug } from '@lib/pages/Policy/reservedSlugs';

import { authenticatedOrPublished } from './access';

import type { CollectionConfig, TextField } from 'payload';

// Legal pages (legal notice, privacy policy…), each served at `/<slug>`
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
        // A hook rather than `validate`: the slug generated from the title only exists once the
        // field hooks have run, after validation
        slug.hooks = {
          beforeChange: [
            ({ value }) => {
              if (isReservedSlug(value)) {
                throw new ValidationError({
                  collection: 'policies',
                  errors: [
                    {
                      path: 'slug',
                      message: `"${value}" is already used by another part of the site.`,
                    },
                  ],
                });
              }
              return value;
            },
          ],
        };
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
