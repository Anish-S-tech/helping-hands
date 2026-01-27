'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type RoleType = 'builder' | 'founder';

interface RoleContextType {
    selectedRole: RoleType | null;
    setSelectedRole: (role: RoleType | null) => void;
    clearSelectedRole: () => void;
    hasSelectedRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'selected_role';

export function RoleProvider({ children }: { children: ReactNode }) {
    const [selectedRole, setSelectedRoleState] = useState<RoleType | null>(null);

    // Load role from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(ROLE_STORAGE_KEY);
            if (stored === 'builder' || stored === 'founder') {
                setSelectedRoleState(stored);
            }
        }
    }, []);

    const setSelectedRole = (role: RoleType | null) => {
        setSelectedRoleState(role);
        if (typeof window !== 'undefined') {
            if (role) {
                localStorage.setItem(ROLE_STORAGE_KEY, role);
            } else {
                localStorage.removeItem(ROLE_STORAGE_KEY);
            }
        }
    };

    const clearSelectedRole = () => {
        setSelectedRoleState(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ROLE_STORAGE_KEY);
        }
    };

    const hasSelectedRole = selectedRole !== null;

    return (
        <RoleContext.Provider
            value={{
                selectedRole,
                setSelectedRole,
                clearSelectedRole,
                hasSelectedRole,
            }}
        >
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}
