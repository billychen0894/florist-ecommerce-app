'use client';

import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

interface HoverCardProps {
  screenReaderText: string;
  hoverCardText: string;
}

export function HoverCard({ screenReaderText, hoverCardText }: HoverCardProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  let tooltipTimeout: NodeJS.Timeout;

  const handleMouseEnter = (delay: number) => {
    tooltipTimeout = setTimeout(() => {
      setIsTooltipVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout);
    setIsTooltipVisible(false);
  };

  return (
    <span
      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500 relative"
      onMouseEnter={handleMouseEnter.bind(null, 500)}
      onMouseLeave={handleMouseLeave}
    >
      <span className="sr-only">{screenReaderText}</span>
      <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />

      {isTooltipVisible && (
        <span className="text-shades-500 absolute z-10 w-72 sm:w-80 top-full left-1/2 transform -translate-x-1/3 bg-white shadow-lg p-4 text-sm rounded-md mt-2 leading-6">
          {hoverCardText}
        </span>
      )}
    </span>
  );
}
