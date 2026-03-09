import React, { useEffect, useState } from 'react';
import { api } from '../axiosSetup';
import { API_ENDPOINT } from '../apiEndpoints';

function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(API_ENDPOINT.userProfile);
                if (res.data.success) {
                    const data = Array.isArray(res.data.results) ? res.data.results[0] : res.data.results;
                    setProfile(data);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError("Failed to synchronize profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-sky-500 font-mono animate-pulse tracking-widest text-xs">IDENTIFYING USER...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-rose-400 text-sm font-bold">
                ⚠️ {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-20 flex justify-center">
            <div className="max-w-2xl w-full">
                <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    
                    <div className="h-32 bg-linear-to-r from-sky-600 to-indigo-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-slate-900 border-4 border-[#1e293b] rounded-2xl flex items-center justify-center shadow-xl">
                                <span className="text-3xl font-black text-sky-500">
                                    {profile?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{profile?.name}</h1>
                                <p className="text-sky-500 font-mono text-xs font-bold tracking-widest">{profile?.email}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                profile?.status === 'active' 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                                {profile?.status || 'Unknown'}
                            </span>
                        </div>

                        <hr className="border-slate-800 mb-8" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Personnel Role</label>
                                <p className="text-white font-bold text-lg capitalize">{profile?.role}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Date</label>
                                <p className="text-white font-bold text-lg">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>


                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Unique ID</label>
                                <p className="text-sky-400 font-mono text-sm font-bold">#USR-{profile?.id?.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                    </div>
                </div>
                
                <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.3em] font-bold">
                    Secure Data Access • Fleet Logistics Management
                </p>
            </div>
        </div>
    );
}

export default UserProfile;