import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../Button';
import '@testing-library/jest-dom';

describe('Button Snapshot', () => {
  it('matches default rendering', () => {
    const { asFragment } = render(<Button>Snapshot</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});
