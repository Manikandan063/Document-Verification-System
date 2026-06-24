import { cn } from '../../lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, colorClass = "bg-white" }) {
  return (
    <div className={cn("p-6 rounded-2xl shadow-soft flex items-start justify-between border border-gray-100", colorClass)}>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-brand-dark">{value}</h3>
        {trend && (
          <p className="text-xs font-medium mt-2 text-brand-green">
            {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center border border-white/40">
        <Icon size={24} className="text-brand-dark" />
      </div>
    </div>
  );
}
