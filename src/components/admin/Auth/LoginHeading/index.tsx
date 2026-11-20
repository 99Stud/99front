import { FC } from 'react';

// Payload's login view has no heading of its own, unlike its other auth screens
export const LoginHeading: FC = () => (
  <>
    <h1>Log in to 99stud</h1>
    <p>Enter your credentials to manage the site.</p>
  </>
);
