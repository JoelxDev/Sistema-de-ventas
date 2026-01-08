import { Outlet } from 'react-router-dom';
import { MenuLateral } from '../components/MenuLateral';

export function MainLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc' }}>
        <MenuLateral />
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}