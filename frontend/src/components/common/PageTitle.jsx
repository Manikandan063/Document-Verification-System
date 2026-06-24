export default function PageTitle({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-brand-dark">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}
