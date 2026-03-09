import {Outlet} from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Sidebar from "./components/SideBar.jsx";

function Layout() {
	return (
		<div className="flex">
			{/* Sidebar */}
			<Sidebar />

			<div className="flex-1 flex flex-col">
				{/* Header */}
				<Header />

				{/* Page Content */}
				<main className="p-6 bg-[#0f172a] min-h-screen text-slate-200">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default Layout;
