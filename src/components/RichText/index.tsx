import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react';
import clsx from 'clsx';
import { FC } from 'react';

import { DOCUMENT_PATHS, isLinkableCollection } from '@lib/documentPaths';

import type { DefaultTypedEditorState, SerializedLinkNode } from '@payloadcms/richtext-lexical';

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const { doc } = linkNode.fields;
  // The linked document is only populated when the content is fetched with `depth >= 1`
  if (!doc || typeof doc.value !== 'object' || typeof doc.value.slug !== 'string') return '#';
  if (!isLinkableCollection(doc.relationTo)) return '#';
  return DOCUMENT_PATHS[doc.relationTo](doc.value.slug);
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
});

type Props = {
  data: DefaultTypedEditorState;
  className?: string;
};

// Renders Payload rich text (Lexical) on the server, styled by the typography plugin
export const RichText: FC<Props> = ({ data, className }) => (
  <LexicalRichText
    className={clsx('prose dark:prose-invert', className)}
    converters={converters}
    data={data}
  />
);
