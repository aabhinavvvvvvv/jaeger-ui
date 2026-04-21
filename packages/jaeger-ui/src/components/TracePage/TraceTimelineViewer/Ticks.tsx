// Copyright (c) 2017 Uber Technologies, Inc.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { formatDuration } from '../../../utils/date';
import { TNil } from '../../../types';
import { IOtelSpan } from '../../../types/otel';

import './Ticks.css';

// Minimum pixel spacing between adjacent tick labels to prevent overlap.
const MIN_LABEL_SPACING_PX = 80;

type TicksProps = {
  numTicks: number;
  showLabels?: boolean | TNil;
  startTime?: IOtelSpan['startTime'] | TNil;
  endTime?: IOtelSpan['endTime'] | TNil;
};

export default function Ticks({ endTime = null, numTicks, showLabels = null, startTime = null }: TicksProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    if (!showLabels || !containerRef.current) return undefined;
    const el = containerRef.current;
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showLabels]);

  let labels: undefined | string[];
  if (showLabels) {
    labels = [];
    const viewingDuration = (endTime || 0) - (startTime || 0);
    for (let i = 0; i < numTicks; i++) {
      const durationAtTick = (startTime || 0) + (i / (numTicks - 1)) * viewingDuration;
      labels.push(formatDuration(durationAtTick as IOtelSpan['duration']));
    }
  }

  // Compute label step as a power of 2 so intermediate labels are evenly spaced.
  // A step of N means only every Nth tick gets a label (plus always the first and last).
  let labelStep = 1;
  if (labels && containerWidth > 0 && numTicks > 1) {
    const tickSpacing = containerWidth / (numTicks - 1);
    while (tickSpacing * labelStep < MIN_LABEL_SPACING_PX && labelStep < numTicks) {
      labelStep *= 2;
    }
  }

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < numTicks; i++) {
    const portion = i / (numTicks - 1);
    const isLast = i === numTicks - 1;
    const showLabel = labels != null && (i === 0 || isLast || i % labelStep === 0);
    ticks.push(
      <div
        key={portion}
        className="Ticks--tick"
        style={{
          left: `${portion * 100}%`,
        }}
      >
        {showLabel && (
          <span className={`Ticks--tickLabel ${portion >= 1 ? 'isEndAnchor' : ''}`}>{labels![i]}</span>
        )}
      </div>
    );
  }
  return (
    <div className="Ticks" ref={containerRef}>
      {ticks}
    </div>
  );
}
