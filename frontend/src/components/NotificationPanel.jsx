import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import toast from "react-hot-toast";
function NotificationPanel({isOpen, onClose,notifications,setNotifications}) {
	const markAsRead=async (id)=>{
		try {
			const res=await api.put(API_ENDPOINT.markNotificationAsRead(id))
			if(res.data.success)
			{
				setNotifications((prev)=>prev.map((nt)=>(
					nt.id===id?{...nt,status:"read"}:nt
				)))
			}
		} catch (error) {
			if(error.response)
			{
				toast.error(error.response.data.message)
			}else{
				console.log(error);
				toast.error("Server Error")
			}
		}
	}
	const markAsUnRead=async (id)=>{
		try {
			const res=await api.put(API_ENDPOINT.markNotificationAsUnread(id))
			if(res.data.success)
			{
				setNotifications((prev)=>prev.map((nt)=>(
					nt.id===id?{...nt,status:"unread"}:nt
				)))
			}
		} catch (error) {
			if(error.response)
			{
				toast.error(error.response.data.message)
			}else{
				console.log(error);
				
				toast.error("Server Error")
			}
		}
	}
	const getTimeAgo = (dateString) => {
		const now = new Date();
		console.log("now : ",now);
		const created = new Date(dateString);
		console.log("created : ",created);

		const diffInMs = now - created;
		console.log("diff in ms",diffInMs);
		
		const diffInMinutes = Math.floor(diffInMs / (60000));
		console.log("diff in minutes",diffInMinutes);
		const diffInHours = Math.floor(diffInMs / (3600000));
		console.log("diff in hours",diffInHours);
		const diffInDays = Math.floor(diffInMs / (3600000 * 24));
		console.log("diff in day",diffInDays);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} minutes ago`;
		}

		if (diffInHours < 24) {
			return `${diffInHours} hours ago`;
		}

		return `${diffInDays} days ago`;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex justify-end">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

			{/* Drawer */}
			<div className="relative w-80 max-w-md h-full bg-[#1e293b] border-l border-slate-800 shadow-2xl flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-800/40">
					<h3 className="text-sm font-bold uppercase text-slate-200 tracking-wider">Notifications</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-rose-400 text-sm font-bold">
						Close
					</button>
				</div>

				{/* List */}
				<div className="flex-1 overflow-y-auto divide-y divide-slate-800">
					{notifications.length > 0 ? (
						notifications.map((item) => (
							<div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors">
								{/* Left icon */}
								<div className="mt-1">{item.status === "unread" ? <span className="w-2 h-2 bg-sky-500 rounded-full block"></span> : <span className="w-2 h-2 bg-transparent block"></span>}</div>

								{/* Content */}
								<div className="flex-1">
									<p className={`text-sm ${item.status === "unread" ? "text-white font-semibold" : "text-slate-300"}`}>{item.message}</p>

									<div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
										<span>{getTimeAgo(item.createdAt)}</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col items-end gap-2">
									{item.status === "unread" ? <button onClick={(e)=>markAsRead(item.id)} className="text-sky-500 text-xs hover:text-sky-400">Mark Read</button> : <button className="text-sky-500 text-xs hover:text-sky-400" onClick={()=>markAsUnRead(item.id)}>Mark Unread</button>}
								</div>
							</div>
						))
					) : (
						<div className="px-4 py-6 text-center text-slate-600 text-xs italic uppercase tracking-widest">No notifications available</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default NotificationPanel;
