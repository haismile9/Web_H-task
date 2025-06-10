// src/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
