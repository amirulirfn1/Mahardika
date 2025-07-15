import React from 'react';
import { render } from '@testing-library/react';
import { BrandCard } from '../../../src/BrandCard';
import '@testing-library/jest-dom';

describe('BrandCard Snapshot', () => {
  it('matches default rendering', () => {
    const { asFragment } = render(
      <BrandCard title="Snapshot" description="Testing" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
