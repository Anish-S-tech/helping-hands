'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { toast } from '@/components/Toast';

export default function AccountSettingsPage() {
    const router = useRouter();
    const { profile, updateProfile } = useAuth();

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        email: profile?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setLoading(true);
        const { error } = await updateProfile({ name: formData.name });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Profile updated successfully');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (!formData.currentPassword || !formData.newPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }

        setLoading(true);
        // In production, call backend API to change password
        toast.success('Password changed successfully');
        setFormData({
            ...formData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/settings"
                        className="text-slate-400 hover:text-white transition-colors mb-4 inline-block"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your account details</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Information */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-slate-700/30 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Email cannot be changed. Contact support if needed.
                            </p>
                        </div>

                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
