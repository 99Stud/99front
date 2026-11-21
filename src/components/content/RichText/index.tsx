import {
  type JSXConverter,
  type JSXConvertersFunction,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react';
import clsx from 'clsx';
import { FC } from 'react';

import { resolveInternalLink } from '@lib/richText/resolveInternalLink';
import { validateLinkUrl } from '@lib/richText/validateLinkUrl';

import type {
  DefaultTypedEditorState,
  SerializedAutoLinkNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical';

// Replaces Payload's link converter, which renders any stored address. The editor refuses unsafe
// addresses on save, but content saved before that rule (or written through the API with access
// overridden) is rendered too: such a link keeps its text and loses its target.
const renderLink: JSXConverter<SerializedAutoLinkNode | SerializedLinkNode> = ({
  node,
  nodesToJSX,
}) => {
  const children = nodesToJSX({ nodes: node.children });
  const { doc, linkType, newTab, url } = node.fields;
  if (validateLinkUrl(url, linkType) !== true) return <>{children}</>;

  return (
    <a
      href={linkType === 'internal' ? resolveInternalLink(doc) : url}
      rel={newTab ? 'noopener noreferrer' : undefined}
      target={newTab ? '_blank' : undefined}
    >
      {children}
    </a>
  );
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  autolink: renderLink,
  link: renderLink,
});

type Props = {
  data: DefaultTypedEditorState;
  className?: string;
};

// A server component on purpose: none of the editor's code reaches visitors. Styled by the
// typography plugin, since rich text arrives as bare elements that Tailwind's reset leaves unstyled
export const RichText: FC<Props> = ({ data, className }) => (
  <LexicalRichText
    className={clsx('prose prose-invert', className)}
    converters={converters}
    data={data}
  />
);
