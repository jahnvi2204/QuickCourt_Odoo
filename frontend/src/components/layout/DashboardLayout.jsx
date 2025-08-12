import React from 'react';
import Layout from './Layout.jsx';

export default function DashboardLayout({ dark, onToggleTheme, children, sidebar }) {
  return (
    <Layout dark={dark} onToggleTheme={onToggleTheme}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <aside className="lg:col-span-1">
          {sidebar || (
            <div className="card">Sidebar</div>
          )}
        </aside>
        <section className="lg:col-span-4">
          {children}
        </section>
      </div>
    </Layout>
  );
}


