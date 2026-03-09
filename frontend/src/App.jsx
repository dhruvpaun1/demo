import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/Home";
import Login from "../src/components/Login";
import {Provider} from "react-redux";
import store from "./store";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewHistory from "./components/ViewHistory";
import UserManagement from "./components/UserManagement";
import PackageManagement from "./components/PackageManagement";
import PackageManagementForUser from "./components/PackageManagementForUser";
import UserProfile from "./components/UserProfile";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./components/PublicRoute";
import GenerateInvoice from "./components/GenerateInvoice";
import ViewAllManifests from "./components/ViewAllManifests.jsx";
import ViewManifestPackages from "./components/ViewManifestPackages.jsx";
import {Toaster} from "react-hot-toast";
import AddQueryForUser from "./components/AddQueryForUser.jsx";
import AdminQueryManagement from "./components/AdminQueryManagement.jsx";
import ViewAllInvoiceForUser from "./components/ViewAllInvoiceForUser.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import StatusPage from "./components/StatusPage.jsx";
import Deliveries from "./components/Deliveries.jsx";
import ShowAllInvoices from "./components/ShowAllInvoices.jsx";
function App() {
	return (
		<Provider store={store}>
			<Toaster />

			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route
							path="/login"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>
						<Route path="/add-package" element={<PackageManagement />}></Route>
						<Route
							path="/my-packages"
							element={
								<ProtectedRoute>
									<PackageManagementForUser />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<Dashboard />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/scheduled-deliveries"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<Deliveries />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						
						<Route
							path="/admin/view-history"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<ViewHistory />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/create-invoice"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<ShowAllInvoices/>
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manifests"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<ViewAllManifests />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route path="/checkout/:invoiceId" element={<CheckoutPage />} />
						<Route
							path="/admin/manifests/:manifestId"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<ViewManifestPackages />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route path="/payment-status" element={<StatusPage />} />
						<Route
							path="/user/view-history"
							element={
								<ProtectedRoute>
									<ViewHistory />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user/report-query"
							element={
								<ProtectedRoute>
									<AddQueryForUser />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user/view-invoice"
							element={
								<ProtectedRoute>
									<ViewAllInvoiceForUser />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/manage-user"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<UserManagement />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/view-queries"
							element={
								<ProtectedRoute>
									<AdminRoute>
										<AdminQueryManagement />
									</AdminRoute>
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
