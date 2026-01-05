'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
    ArrowLeft, Loader2, Plus, X, Rocket,
    Users, Code, Palette, LineChart, Database
} from 'lucide-react';

const SKILL_SUGGESTIONS = [
    'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript',
    'UI/UX Design', 'Figma', 'Product Management', 'DevOps',
    'Machine Learning', 'Data Science', 'Mobile Development',
    'Flutter', 'React Native', 'Go', 'Rust', 'AWS', 'Docker'
];

export default function NewProjectPage() {
    const router = useRouter();
    const { profile, supabase } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills_needed: [] as string[],
        team_size_needed: 3,
    });

    const [skillInput, setSkillInput] = useState('');

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !formData.skills_needed.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                skills_needed: [...prev.skills_needed, trimmed]
            }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills_needed: prev.skills_needed.filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Project title is required');
            return;
        }

        if (!formData.description.trim()) {
            setError('Project description is required');
            return;
        }

        setLoading(true);

        const { data, error: insertError } = await supabase
            .from('projects')
            .insert({
                founder_id: profile?.id,
                title: formData.title,
                description: formData.description,
                skills_needed: formData.skills_needed,
                team_size_needed: formData.team_size_needed,
                status: 'open',
            })
            .select()
            .single();

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
        } else {
            router.push(`/projects/${data.id}`);
        }
    };

    const filteredSuggestions = SKILL_SUGGESTIONS.filter(
        skill =>
            skill.toLowerCase().includes(skillInput.toLowerCase()) &&
            !formData.skills_needed.includes(skill)
    );

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-3xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/founder"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Create New Project</h1>
                    <p className="text-slate-400 mt-2">Post a project and find talented team members</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Project Title */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Rocket className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Project Details</h2>
                                <p className="text-sm text-slate-400">Give your project a clear name and description</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="e.g., AI-Powered Task Manager"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={5}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                                    placeholder="Describe your project, its goals, and what you're looking to build..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Needed */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Code className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Skills Needed</h2>
                                <p className="text-sm text-slate-400">What skills are you looking for in team members?</p>
                            </div>
                        </div>

                        {/* Selected Skills */}
                        {formData.skills_needed.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.skills_needed.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Skill Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSkill(skillInput);
                                    }
                                }}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder="Type a skill and press Enter..."
                            />
                        </div>

                        {/* Suggestions */}
                        {skillInput && filteredSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {filteredSuggestions.slice(0, 6).map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSkill(skill)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full text-sm transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick Add */}
                        {!skillInput && (
                            <div className="mt-4">
                                <p className="text-xs text-slate-500 mb-2">Quick add:</p>
                                <div className="flex flex-wrap gap-2">
                                    {SKILL_SUGGESTIONS.slice(0, 8).filter(s => !formData.skills_needed.includes(s)).map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => addSkill(skill)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded-full text-sm transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Team Size */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Team Size</h2>
                                <p className="text-sm text-slate-400">How many team members do you need?</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, team_size_needed: Math.max(1, prev.team_size_needed - 1) }))}
                                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                            >
                                -
                            </button>
                            <span className="text-3xl font-bold text-white w-16 text-center">
                                {formData.team_size_needed}
                            </span>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, team_size_needed: Math.min(20, prev.team_size_needed + 1) }))}
                                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                            >
                                +
                            </button>
                            <span className="text-slate-400 ml-2">team members</span>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Project...
                            </>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                Create Project
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
