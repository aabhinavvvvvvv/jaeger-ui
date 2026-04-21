// Copyright (c) 2017 Uber Technologies, Inc.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Ticks from './Ticks';

// ResizeObserver is not available in jsdom; provide a minimal stub.
class ResizeObserverStub {
  constructor(cb) {
    this.cb = cb;
  }

  observe() {}

  disconnect() {}
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverStub;
});

describe('<Ticks>', () => {
  it('renders without exploding', () => {
    const { container } = render(<Ticks endTime={200} numTicks={5} showLabels startTime={100} />);
    expect(container).toBeDefined();
  });

  it('renders tick lines for every tick regardless of showLabels', () => {
    const { container } = render(<Ticks numTicks={5} />);
    expect(container.querySelectorAll('.Ticks--tick')).toHaveLength(5);
  });

  it('renders labels when showLabels is true', () => {
    const { container } = render(<Ticks endTime={1000} numTicks={5} showLabels startTime={0} />);
    // All labels visible by default (containerWidth is 0, so labelStep stays 1).
    // First and last are always shown; intermediate ticks also show at step=1.
    expect(container.querySelectorAll('.Ticks--tickLabel').length).toBeGreaterThan(0);
  });

  it('applies isEndAnchor class only to the last label', () => {
    const { container } = render(<Ticks endTime={1000} numTicks={5} showLabels startTime={0} />);
    const anchors = container.querySelectorAll('.Ticks--tickLabel.isEndAnchor');
    expect(anchors).toHaveLength(1);
  });

  it('does not render labels when showLabels is omitted', () => {
    const { container } = render(<Ticks numTicks={5} />);
    expect(container.querySelectorAll('.Ticks--tickLabel')).toHaveLength(0);
  });
});
