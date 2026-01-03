export function PageLayout({ children }) {
  return (
    <div className="page">
      <div className="container stack-lg">{children}</div>
    </div>
  );
}
