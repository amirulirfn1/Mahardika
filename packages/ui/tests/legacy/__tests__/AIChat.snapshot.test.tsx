import React from 'react';
import { render } from '@testing-library/react';
import { AIChat } from '../AIChat';
import '@testing-library/jest-dom';

describe('AIChat Snapshot', () => {
  it('matches default rendering', () => {
    const { asFragment } = render(<AIChat />);
    expect(asFragment()).toMatchSnapshot();
  });
});
