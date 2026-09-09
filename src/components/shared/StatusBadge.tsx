import { CheckCircle2, CircleDot, Clock, Trees } from 'lucide-react';
import type { ReportStatus } from '../../types';

export function StatusBadge({ status }: { status: ReportStatus | string }) {
  if (status === 'Pending Review' || status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        Pending Review
      </span>
    );
  }

  if (status === 'Reviewed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
        Reviewed
      </span>
    );
  }

  if (status === 'Task Dispatched' || status === 'Flagged for Tree Planting') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
        <Trees className="h-3.5 w-3.5 text-emerald-600" />
        Planting Dispatched
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
      <CheckCircle2 className="h-3.5 w-3.5 text-gray-500" />
      {status}
    </span>
  );
}
