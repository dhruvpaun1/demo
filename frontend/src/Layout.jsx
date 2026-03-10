import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/SideBar.jsx";

function Layout() {
    // Default width is 256px (w-64)
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#020617] overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
                width={sidebarWidth} 
                setWidth={setSidebarWidth} 
                isOpen={isMobileOpen} 
                setIsOpen={setIsMobileOpen} 
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen">
                <Header onMenuClick={() => setIsMobileOpen(true)} />

                <main className="p-6 bg-[#0f172a] flex-1 text-slate-200 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;