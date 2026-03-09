import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout} from "../authSlice";
import SimpleBadge from "./NotificationIcon";
import NotificationBell from "./NotificationIcon";
import NotificationPanel from "./NotificationPanel";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import toast from "react-hot-toast";
import {socket} from "../socket";
function Header() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {isAuthenticated, user} = useSelector((state) => state.auth);
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	useEffect(() => {
		console.log("User value:", user);

		if (!user?.id) return;


		socket.on("newNotification", (data) => {
			setNotifications((prev) => [data, ...prev]);
		});
		socket.emit("register", user.id);
		console.log("Registering socket for user:", user.id);
		return () => {
			socket.off("newNotification");
		};
	}, [user]);
	const unread = notifications.filter((nt) => nt.status === "unread").length;
	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<header className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex justify-between items-center">
			{/* Left */}
			<div className="text-white font-bold text-lg tracking-tight">FLEET</div>

			{/* Right */}
			<div>
				
				{isAuthenticated ? (
					<div className="flex items-center gap-4">
						
						<span className="text-slate-300 text-sm">
							<button onClick={(e) => setIsOpen(true)} className="text-sky-400 font-semibold">
								{<NotificationBell count={unread} />}
							</button>
						</span>
						<span className="text-slate-300 text-sm">
							Hi, <span className="text-sky-400 font-semibold">{user?.username?.toUpperCase()}</span>
						</span>

						<button
							onClick={handleLogout}
							className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
							Logout
						</button>
						<NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} notifications={notifications} setNotifications={setNotifications} />
					</div>
				) : (
					<button onClick={() => navigate("/login")} className="bg-sky-500 hover:bg-sky-400 text-[#0f172a] px-5 py-2 rounded-lg text-sm font-bold transition-all">
						Login
					</button>
				)}
			</div>
		</header>
	);
}

export default Header;
