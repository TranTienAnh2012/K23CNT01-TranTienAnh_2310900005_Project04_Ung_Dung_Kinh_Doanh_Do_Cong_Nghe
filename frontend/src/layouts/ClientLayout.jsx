import React from 'react';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
      <Outlet />
    </div>
  );
};

export default ClientLayout;
