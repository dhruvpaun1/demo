import React, { useEffect, useState } from "react";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";

function NotificationBell({count}) {
  return (
    <div className="relative inline-block cursor-pointer">
      
      {/* Bell Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-slate-700 hover:text-blue-600 transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
          a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341
          C7.67 6.165 6 8.388 6 11v3.159
          c0 .538-.214 1.055-.595 1.436L4 17h5m6 0
          v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Notification Counter */}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

export default NotificationBell;
