'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Lock, Globe, Download, Trash2, Shield } from 'lucide-react';
import { toast } from '@/components/Toast';

export default function PrivacySettingsPage() {
    const [settings, setSettings] = useState({
        profileVisibility: 'public' as 'public' | 'members' | 'private',
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        allowProjectInvites: true,
    });

    const handleSaveSettings = () => {
        toast.success('Privacy settings updated');
    };

    const handleDownloadData = () => {
        toast.success('Your data download has been initiated. You will receive an email shortly.');
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
                    <h1 className="text-3xl font-bold text-white">Privacy Settings</h1>
                    <p className="text-slate-400 mt-1">Control your privacy and data sharing</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Visibility */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Profile Visibility
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                Who can see your profile?
                            </label>
                            <div className="space-y-3">
                                {[
                                    { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                                    { value: 'members', label: 'Members Only', desc: 'Only logged-in members can view' },
                                    { value: 'private', label: 'Private', desc: 'Only you can view your profile' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${settings.profileVisibility === option.value
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value={option.value}
                                            checked={settings.profileVisibility === option.value}
                                            onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="text-white font-medium">{option.label}</p>
                                            <p className="text-sm text-slate-400">{option.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700 space-y-4">
                            <label className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Show Email</p>
                                    <p className="text-sm text-slate-400">Display your email on your profile</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showEmail: !settings.showEmail })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.showEmail ? 'bg-purple-500' : 'bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.showEmail ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </label>

                            <label className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Show Phone</p>
                                    <p className="text-sm text-slate-400">Display your phone number on your profile</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showPhone: !settings.showPhone })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.showPhone ? 'bg-purple-500' : 'bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.showPhone ? 'translate-x-6' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Communication Preferences */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Communication
                    </h2>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Allow Direct Messages</p>
                                <p className="text-sm text-slate-400">Let other members send you messages</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, allowMessages: !settings.allowMessages })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.allowMessages ? 'bg-purple-500' : 'bg-slate-600'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.allowMessages ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </label>

                        <label className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Allow Project Invites</p>
                                <p className="text-sm text-slate-400">Let founders invite you to projects</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, allowProjectInvites: !settings.allowProjectInvites })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.allowProjectInvites ? 'bg-purple-500' : 'bg-slate-600'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.allowProjectInvites ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </label>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Data Management
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={handleDownloadData}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-600 hover:border-purple-500 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-purple-400" />
                                <div className="text-left">
                                    <p className="text-white font-medium">Download Your Data</p>
                                    <p className="text-sm text-slate-400">Get a copy of your data</p>
                                </div>
                            </div>
                        </button>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <p className="text-blue-300 text-sm">
                                <strong>Your data is secure.</strong> We use industry-standard encryption to protect your information.
                                Your data is never shared with third parties without your consent.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaveSettings}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    Save Privacy Settings
                </button>
            </div>
        </div>
    );
}
