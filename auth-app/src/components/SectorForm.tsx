'use client';

import { ReactNode } from 'react';

interface SectorField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'url';
    options?: string[];
    placeholder?: string;
    required?: boolean;
    description?: string;
}

interface SectorConfig {
    name: string;
    description: string;
    fields: SectorField[];
}

const sectorConfigs: Record<string, SectorConfig> = {
    technology: {
        name: 'Technology',
        description: 'Software, hardware, and tech innovation projects',
        fields: [
            {
                name: 'tech_stack',
                label: 'Tech Stack',
                type: 'text',
                placeholder: 'React, Node.js, PostgreSQL',
                description: 'Technologies you\'ll be working with',
            },
            {
                name: 'github_repo',
                label: 'GitHub Repository (Optional)',
                type: 'url',
                placeholder: 'https://github.com/username/repo',
            },
            {
                name: 'development_stage',
                label: 'Development Stage',
                type: 'select',
                options: ['Idea', 'Prototype', 'MVP', 'Beta', 'Production'],
                required: true,
            },
        ],
    },
    design: {
        name: 'Design',
        description: 'UI/UX, graphic design, and creative projects',
        fields: [
            {
                name: 'design_tools',
                label: 'Design Tools',
                type: 'text',
                placeholder: 'Figma, Adobe XD, Sketch',
                description: 'Tools you\'re proficient in',
            },
            {
                name: 'portfolio',
                label: 'Portfolio URL',
                type: 'url',
                placeholder: 'https://yourportfolio.com',
            },
            {
                name: 'design_focus',
                label: 'Design Focus',
                type: 'select',
                options: ['UI Design', 'UX Design', 'Branding', 'Illustration', 'Motion Graphics'],
            },
        ],
    },
    marketing: {
        name: 'Marketing',
        description: 'Growth, content, and marketing projects',
        fields: [
            {
                name: 'marketing_channels',
                label: 'Marketing Channels Experience',
                type: 'text',
                placeholder: 'Social Media, SEO, Email Marketing',
                description: 'Channels you have experience with',
            },
            {
                name: 'marketing_tools',
                label: 'Marketing Tools',
                type: 'text',
                placeholder: 'Google Analytics, HubSpot, Mailchimp',
            },
            {
                name: 'past_campaigns',
                label: 'Past Campaign Results (Optional)',
                type: 'textarea',
                placeholder: 'Briefly describe successful campaigns you\'ve run',
            },
        ],
    },
    business: {
        name: 'Business Development',
        description: 'Strategy, operations, and business projects',
        fields: [
            {
                name: 'industry_experience',
                label: 'Industry Experience',
                type: 'text',
                placeholder: 'SaaS, E-commerce, Healthcare',
                description: 'Industries you have experience in',
            },
            {
                name: 'business_skills',
                label: 'Key Business Skills',
                type: 'text',
                placeholder: 'Market Research, Financial Planning, Partnerships',
            },
            {
                name: 'why_interested',
                label: 'Why This Project?',
                type: 'textarea',
                placeholder: 'What attracts you to this project and what value can you bring?',
                required: true,
            },
        ],
    },
};

interface SectorFormProps {
    sector: string;
    values: Record<string, string>;
    onChange: (field: string, value: string) => void;
}

export function SectorForm({ sector, values, onChange }: SectorFormProps) {
    const config = sectorConfigs[sector.toLowerCase()];

    if (!config) {
        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <p className="text-slate-400 text-center">
                    Select a sector to see specific application fields
                </p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{config.name} Details</h3>
                <p className="text-sm text-slate-400">{config.description}</p>
            </div>

            <div className="space-y-4">
                {config.fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                value={values[field.name] || ''}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                rows={3}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                value={values[field.name] || ''}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                required={field.required}
                            >
                                <option value="">Select {field.label.toLowerCase()}</option>
                                {field.options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                value={values[field.name] || ''}
                                onChange={(e) => onChange(field.name, e.target.value)}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}

                        {field.description && (
                            <p className="text-xs text-slate-400 mt-1">{field.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export available sectors for use in other components
export const availableSectors = Object.keys(sectorConfigs).map((key) => ({
    value: key,
    label: sectorConfigs[key].name,
}));
