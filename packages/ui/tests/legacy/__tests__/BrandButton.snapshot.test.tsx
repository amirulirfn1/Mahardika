import React from 'react';
import { render } from '@testing-library/react';
import { BrandButton } from '../BrandButton';
import '@testing-library/jest-dom';

describe('BrandButton Snapshot', () => {
  it('matches default rendering', () => {
    const { asFragment } = render(<BrandButton>Action</BrandButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});
