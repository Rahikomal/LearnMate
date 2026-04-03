import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => {
  return (
    <aside className={`sidebar-adaptive glass border-none md:border-r border-border/50 sticky top-[5rem] self-start max-h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar ${className}`}>
      <div className="flex flex-col gap-[1.5rem] p-[1.5rem]">
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;
