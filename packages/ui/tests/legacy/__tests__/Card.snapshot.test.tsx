import React from 'react';
import { render } from '@testing-library/react';
import { Card } from '../Card';
import '@testing-library/jest-dom';

describe('Card Snapshot', () => {
  it('matches default rendering', () => {
    const { asFragment } = render(
      <Card>
        <p>Content</p>
      </Card>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
