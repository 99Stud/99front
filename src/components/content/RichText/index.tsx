import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react';
import clsx from 'clsx';
import { FC } from 'react';

import { resolveInternalLink } from '@lib/richText/resolveInternalLink';

import type { DefaultTypedEditorState, SerializedLinkNode } from '@payloadcms/richtext-lexical';

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string =>
  resolveInternalLink(linkNode.fields.doc);

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
