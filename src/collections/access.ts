import type { Access } from 'payload';

// Visitors only see published documents; logged-in editors also see drafts
export const authenticatedOrPublished: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };
