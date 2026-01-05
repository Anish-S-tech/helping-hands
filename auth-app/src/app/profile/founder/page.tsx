'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    Building, Globe, Briefcase, Upload, Save, Loader2, Camera, X
} from 'lucide-react';
import { toast } from '@/components/Toast';

export default function FounderProfilePage() {
    const router = useRouter();
    const { profile, updateProfile, supabase } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        company_name: '',
        company_website: '',
        about_company: '',
        industry: '',
        founding_year: '',
        team_size: '',
    });

    const [loading, setLoading] = useState(false);

    // Redirect if not founder
    if (profile?.role_type !== 'founder') {
        router.push('/profile/edit');
        return null;
    }

    const handleSave = async () => {
        setLoading(true);

        try {
            // Save to founder_details table
            const { error } = await supabase
                .from('founder_details')
                .upsert({
                    profile_id: profile?.id,
                    company_name: formData.company_name || null,
                    company_website: formData.company_website || null,
                    about_company: formData.about_company || null,
                });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Founder profile updated successfully!');
                router.push('/dashboard/founder');
            }
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/dashboard/founder"
                        className="text-slate-400 hover:text-white transition-colors mb-4 inline-block"
                    >
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Founder Profile</h1>
                    <p className="text-slate-400 mt-1">Manage your company information</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Company Information */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Company Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Company/Project Name *
                            </label>
                            <input
                                type="text"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder="Acme Inc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Company Website
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="url"
                                    value={formData.company_website}
                                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="https://yourcompany.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                About Company
                            </label>
                            <textarea
                                value={formData.about_company}
                                onChange={(e) => setFormData({ ...formData, about_company: e.target.value })}
                                rows={4}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                                placeholder="Tell us about your company, what you're building, and your vision..."
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                This helps potential team members understand your project
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Industry
                                </label>
                                <select
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="">Select industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="saas">SaaS</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Founding Year
                                </label>
                                <input
                                    type="number"
                                    value={formData.founding_year}
                                    onChange={(e) => setFormData({ ...formData, founding_year: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="2024"
                                    min="2000"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Team Size
                            </label>
                            <select
                                value={formData.team_size}
                                onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="">Select team size</option>
                                <option value="1">Just me (Solo founder)</option>
                                <option value="2-5">2-5 people</option>
                                <option value="6-10">6-10 people</option>
                                <option value="11-25">11-25 people</option>
                                <option value="26+">26+ people</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/dashboard/founder"
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
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
        </div>
    );
}
