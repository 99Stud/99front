import { DOCUMENT_PATHS, isLinkableCollection } from '@lib/richText/documentPaths';

// The target of an internal rich text link, as Payload stores it: `value` is the linked document
// when the content was fetched with `depth >= 1`, and only its id otherwise
type InternalLinkTarget = { relationTo: string; value: unknown };

const UNRESOLVED = '#';

// Public address of the document an internal link points to. A link that cannot be resolved
// stays on the page rather than leading to a wrong address.
export const resolveInternalLink = (target: InternalLinkTarget | null | undefined): string => {
  if (!target || !isLinkableCollection(target.relationTo)) return UNRESOLVED;
  const { value } = target;
  if (typeof value !== 'object' || value === null) return UNRESOLVED;
  const { slug } = value as { slug?: unknown };
  if (typeof slug !== 'string' || !slug) return UNRESOLVED;
  return DOCUMENT_PATHS[target.relationTo](slug);
};
