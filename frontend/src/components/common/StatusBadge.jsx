import { cn } from '../../lib/utils';

export default function StatusBadge({ status }) {
  let styles = "bg-gray-100 text-gray-700";

  if (status === 'Approved') styles = "bg-brand-brightgreen/20 text-green-800";
  if (status === 'Rejected') styles = "bg-red-100 text-red-800";
  if (status.includes('Pending')) styles = "bg-brand-cream text-yellow-800";
  if (status === 'Modification Required') styles = "bg-brand-purple/20 text-purple-800";

  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border border-black/5", styles)}>
      {status}
    </span>
  );
}
