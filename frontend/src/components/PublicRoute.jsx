import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
	const {isAuthenticated,role}=useSelector(state=>state.auth)
	if(isAuthenticated && role==="admin")
	{
		return <Navigate to="/admin/dashboard"/>
	}
	if(isAuthenticated && role==="user")
	{
		return <Navigate to="/profile"/>
	}
	return children
}

export default PublicRoute
