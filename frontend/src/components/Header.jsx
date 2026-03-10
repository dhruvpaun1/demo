import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../authSlice";
import NotificationBell from "./NotificationIcon";
import NotificationPanel from "./NotificationPanel";
import { socket } from "../socket";
import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user?.id) return;
        socket.on("newNotification", (data) => {
            setNotifications((prev) => [data, ...prev]);
        });
        socket.emit("register", user.id);
        return () => socket.off("newNotification");
    }, [user]);

    const unread = notifications.filter((nt) => nt.status === "unread").length;

    return (
        <header className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {isAuthenticated && (
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <div className="text-white font-black text-xl tracking-tight">FLEET</div>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => setIsNotifOpen(true)}>
                            <NotificationBell count={unread} />
                        </button>
                        <span className="hidden md:inline text-slate-300 text-sm">
                            Hi, <span className="text-sky-400 font-bold">{user?.username?.toUpperCase()}</span>
                        </span>
                        <button
                            onClick={() => { dispatch(logout()); navigate("/login"); }}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase"
                        >
                            Logout
                        </button>
                        <NotificationPanel 
                            isOpen={isNotifOpen} 
                            onClose={() => setIsNotifOpen(false)} 
                            notifications={notifications} 
                            setNotifications={setNotifications} 
                        />
                    </>
                ) : (
                    <button onClick={() => navigate("/login")} className="bg-sky-500 px-5 py-2 rounded-lg font-bold">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;