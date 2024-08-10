// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
