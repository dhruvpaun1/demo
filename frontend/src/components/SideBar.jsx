import React, { useCallback, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

function Sidebar({ width, setWidth, isOpen, setIsOpen }) {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const isResizing = useRef(false);

    // Mouse Move: Updates width based on X coordinate
    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 450) { // Constraint limits
            setWidth(newWidth);
        }
    }, [setWidth]);

    // Mouse Up: Stops the resizing process
    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", stopResizing);
    }, [handleMouseMove]);

    // Mouse Down: Starts the resizing process
    const startResizing = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopResizing);
    }, [handleMouseMove, stopResizing]);

    if (!isAuthenticated) return null;

    const baseClasses = "block px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1";
    const activeClasses = "bg-sky-500 text-[#0f172a] shadow-[0_0_15px_rgba(14,165,233,0.3)]";
    const inactiveClasses = "text-slate-400 hover:bg-slate-800/50 hover:text-sky-400";

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside 
                style={{ width: isOpen ? '280px' : `${width}px` }}
                className={`fixed inset-y-0 left-0 z-50 bg-[#0f172a] border-r border-slate-800 flex flex-col transition-transform lg:transition-none lg:relative 
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Sidebar Header (Mobile) */}
                <div className="flex items-center justify-between p-6 lg:hidden">
                    <span className="text-white font-black tracking-tighter text-xl">FLEET</span>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400"><X size={24} /></button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4">Navigation</h2>
                    <div className="space-y-1">
                        {role === "user" ? (
                            <>
                                <NavLink to="/profile" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Profile</NavLink>
                                <NavLink to="/my-packages" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Packages</NavLink>
                                <NavLink to="/user/view-history" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Tracking History</NavLink>
                                <NavLink to="/user/view-invoice" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Invoices</NavLink>
                                <NavLink to="/user/report-query" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Report Query</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/admin/dashboard" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Dashboard</NavLink>
                                <NavLink to="/admin/manage-user" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Users</NavLink>
                                <NavLink to="/add-package" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Inventory</NavLink>
                                <NavLink to="/admin/view-history" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Global History</NavLink>
                                <NavLink to="/admin/create-invoice" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Payments</NavLink>
                                <NavLink to="/admin/manifests" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Manifest</NavLink>
                                <NavLink to="/admin/view-queries" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>View Queries</NavLink>
                                <NavLink to="/admin/scheduled-deliveries" className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>Deliveries</NavLink>
                            </>
                        )}
                    </div>
                </div>

                {/* THE RESIZER (Invisible handle on the right edge) */}
                <div
                    onMouseDown={startResizing}
                    className="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 group transition-all"
                >
                    <div className="h-full w-[2px] mx-auto bg-transparent group-hover:bg-sky-500/50 group-active:bg-sky-500" />
                </div>
            </aside>
        </>
    );
}

export default Sidebar;