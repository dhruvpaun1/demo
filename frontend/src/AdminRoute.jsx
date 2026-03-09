import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function AdminRoute({ children }) {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role !== "admin") {
    return <Navigate to="/profile" replace />
  }

  return children
}

export default AdminRoute
