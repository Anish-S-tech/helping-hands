import { Profile } from '@/contexts/auth-context';

/**
 * Permission System for User Management
 * Determines what actions users can perform based on their profile state
 */

export interface PermissionCheck {
    allowed: boolean;
    reason?: string;
}

/**
 * Check if user can view projects
 */
export const canViewProjects = (profile: Profile | null): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in to view projects' };
    }
    return { allowed: true };
};

/**
 * Check if user can apply to projects
 * Requires: logged in, user role, email verified, phone verified, profile completed
 */
export const canApplyToProject = (profile: Profile | null): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in to apply to projects' };
    }

    if (profile.role_type !== 'builder') {
        return { allowed: false, reason: 'Only builders can apply to projects. Founders manage their own projects.' };
    }

    if (!profile.email_verified) {
        return { allowed: false, reason: 'Please verify your email address first' };
    }

    if (!profile.phone_verified) {
        return { allowed: false, reason: 'Please verify your phone number to apply to projects' };
    }

    if (!profile.profile_completed) {
        return { allowed: false, reason: 'Please complete your profile before applying to projects' };
    }

    return { allowed: true };
};

/**
 * Check if founder can create projects
 * Requires: logged in, founder role, email verified, phone verified, profile completed
 */
export const canCreateProject = (profile: Profile | null): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in to create projects' };
    }

    if (profile.role_type !== 'founder') {
        return { allowed: false, reason: 'Only founders can create projects' };
    }

    if (!profile.email_verified) {
        return { allowed: false, reason: 'Please verify your email address first' };
    }

    if (!profile.phone_verified) {
        return { allowed: false, reason: 'Please verify your phone number to create projects' };
    }

    if (!profile.profile_completed) {
        return { allowed: false, reason: 'Please complete your profile before creating projects' };
    }

    return { allowed: true };
};

/**
 * Check if user can manage team (founders only)
 */
export const canManageTeam = (profile: Profile | null, projectFounderId?: string): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in' };
    }

    if (profile.role_type !== 'founder') {
        return { allowed: false, reason: 'Only founders can manage teams' };
    }

    if (projectFounderId && profile.id !== projectFounderId) {
        return { allowed: false, reason: 'You can only manage your own project teams' };
    }

    return { allowed: true };
};

/**
 * Check if user can access chat
 * Requires: profile completed and verified
 */
export const canAccessChat = (profile: Profile | null): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in to access chat' };
    }

    if (!profile.profile_completed) {
        return { allowed: false, reason: 'Please complete your profile to access chat' };
    }

    if (!profile.email_verified) {
        return { allowed: false, reason: 'Please verify your email to access chat' };
    }

    return { allowed: true };
};

/**
 * Check if user can edit a profile
 */
export const canEditProfile = (profile: Profile | null, targetProfileId: string): PermissionCheck => {
    if (!profile) {
        return { allowed: false, reason: 'You must be logged in' };
    }

    if (profile.id !== targetProfileId) {
        return { allowed: false, reason: 'You can only edit your own profile' };
    }

    return { allowed: true };
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (profile: Profile | null): number => {
    if (!profile) return 0;

    const fields = [
        profile.name,
        profile.bio,
        profile.avatar_url,
        profile.experience_level,
        profile.github_url,
        profile.linkedin_url,
        profile.email_verified,
        profile.phone_verified,
    ];

    const completedFields = fields.filter(field => {
        if (typeof field === 'boolean') return field;
        return field && field.trim() !== '';
    }).length;

    return Math.round((completedFields / fields.length) * 100);
};

/**
 * Get required fields for profile completion
 */
export const getRequiredProfileFields = (profile: Profile | null): string[] => {
    if (!profile) return [];

    const missing: string[] = [];

    if (!profile.name?.trim()) missing.push('Full Name');
    if (!profile.bio?.trim()) missing.push('Bio');
    if (!profile.avatar_url) missing.push('Profile Picture');
    if (!profile.experience_level) missing.push('Experience Level');
    if (!profile.email_verified) missing.push('Email Verification');
    if (!profile.phone_verified) missing.push('Phone Verification');

    return missing;
};
