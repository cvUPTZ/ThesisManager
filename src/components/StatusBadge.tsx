import React from 'react';
import { SectionStatus } from '../types/thesis';

const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800',
  review: 'bg-blue-100 text-blue-800',
  final: 'bg-green-100 text-green-800',
};

interface StatusBadgeProps {
  status: SectionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}