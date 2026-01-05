'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface SkillsInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
    suggestions?: string[];
    maxSkills?: number;
}

const DEFAULT_SUGGESTIONS = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
    'Python', 'Java', 'Go', 'Rust', 'C++',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'GraphQL', 'REST API', 'Git', 'CI/CD',
    'UI/UX', 'Figma', 'Adobe XD', 'Tailwind CSS',
    'Machine Learning', 'AI', 'Data Science',
    'Mobile Development', 'Flutter', 'React Native',
];

export function SkillsInput({
    skills,
    onChange,
    suggestions = DEFAULT_SUGGESTIONS,
    maxSkills = 10
}: SkillsInputProps) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredSuggestions = suggestions.filter(
        s => s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s)
    );

    const addSkill = (skill: string) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !skills.includes(trimmedSkill) && skills.length < maxSkills) {
            onChange([...skills, trimmedSkill]);
            setInput('');
            setShowSuggestions(false);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(skills.filter(s => s !== skillToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredSuggestions.length > 0) {
                addSkill(filteredSuggestions[0]);
            } else {
                addSkill(input);
            }
        } else if (e.key === 'Backspace' && !input && skills.length > 0) {
            removeSkill(skills[skills.length - 1]);
        }
    };

    return (
        <div className="space-y-3">
            {/* Skills Tags */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 text-foreground border border-border rounded-lg text-xs font-medium group"
                        >
                            {skill}
                            <button
                                onClick={() => removeSkill(skill)}
                                className="text-muted hover:text-foreground transition-colors"
                                aria-label={`Remove ${skill}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    disabled={skills.length >= maxSkills}
                    placeholder={
                        skills.length >= maxSkills
                            ? `Maximum ${maxSkills} skills reached`
                            : 'Type to add skills...'
                    }
                    className="w-full bg-surface-1 border border-border rounded-xl py-3 px-4 text-white placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 disabled:opacity-50 text-sm"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && input && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-surface-2 border border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map(suggestion => (
                            <button
                                key={suggestion}
                                onClick={() => addSkill(suggestion)}
                                className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-surface-1 hover:text-foreground transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-400">
                {skills.length}/{maxSkills} skills • Press Enter to add
            </p>
        </div>
    );
}
