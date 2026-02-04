// ===== TYPE DEFINITIONS =====

export type ProjectPhase = 'idea' | 'planning' | 'active' | 'review' | 'completed' | 'archived';
export type ProjectRole = 'founder' | 'team_lead' | 'contributor';
export type ActivityType = 'member_joined' | 'role_assigned' | 'status_changed' | 'application_approved' | 'application_rejected' | 'announcement_posted';

export interface Profile {
    id: string;
    full_name: string;
    role_type: 'builder' | 'founder';
    specialization?: string;
    experience_years?: number;
    completion_score: number;
    avatar_url: string;
    github_url?: string;
    linkedin_url?: string;
    is_verified: boolean;
    location?: string;
    bio?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    vision: string;
    sector: string;
    skills_needed: string[];
    team_size_needed: number;
    member_count: number;
    status: 'open' | 'closed' | 'in-progress';
    phase: ProjectPhase;
    commitment: 'low' | 'medium' | 'high';
    created_at: string;
    last_activity: string;
    open_roles: string[];
    applications_pending: number;
    imageUrl?: string;
    founder: {
        id: string;
        name: string;
    };
}

export interface Application {
    id: string;
    project_id: string;
    project_title: string;
    applicant_id: string;
    applicant_name: string;
    applicant_avatar?: string;
    role_applied: string;
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;
    action_required?: boolean;
    private_notes?: string;
}

export interface TeamMember {
    id: string;
    user_id: string;
    name: string;
    avatar_url?: string;
    role: string;
    role_badge: 'founder' | 'lead' | 'developer' | 'designer' | 'analyst';
    project_role: ProjectRole;
    joined_at: string;
    project_id: string;
    status: 'active' | 'inactive';
}

export interface Message {
    id: string;
    room_id: string;
    sender_id: string;
    sender_name: string;
    sender_role: 'founder' | 'user';
    sender_role_title: string;
    sender_project_role?: ProjectRole;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    type: 'project' | 'direct';
    project_id?: string;
    project_name?: string;
    project_phase?: ProjectPhase;
    last_message?: string;
    last_message_time?: string;
    unread_count: number;
    updated_at: string;
    is_archived?: boolean;
    members_count?: number;
}

export interface Announcement {
    id: string;
    project_id: string;
    author_id: string;
    author_name: string;
    author_role: ProjectRole;
    content: string;
    created_at: string;
    is_pinned: boolean;
}

export interface ActivityEntry {
    id: string;
    project_id: string;
    type: ActivityType;
    actor_id: string;
    actor_name: string;
    target_id?: string;
    target_name?: string;
    description: string;
    timestamp: string;
}

// ===== SETTINGS DATA =====
export interface ActiveSession {
    id: string;
    device: string;
    browser: string;
    location: string;
    ip_address: string;
    last_active: string;
    is_current: boolean;
}

export interface LinkedProvider {
    provider: 'google' | 'github';
    email: string;
    connected_at: string;
    is_connected: boolean;
}

export interface NotificationSettings {
    in_app: boolean;
    email: boolean;
    mentions_only: boolean;
    digest_frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

export interface CommunicationSettings {
    who_can_message: 'everyone' | 'team_only' | 'founder_only';
    dm_enabled: boolean;
    announcement_only_mode: boolean;
    quiet_hours_enabled: boolean;
    quiet_hours_start: string;
    quiet_hours_end: string;
    message_retention: '30_days' | '90_days' | '1_year' | 'forever';
}

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
    {
        id: 'session-1',
        device: 'Windows PC',
        browser: 'Chrome 120',
        location: 'Mumbai, India',
        ip_address: '192.168.1.***',
        last_active: '2026-01-08T16:30:00Z',
        is_current: true
    },
    {
        id: 'session-2',
        device: 'MacBook Pro',
        browser: 'Safari 17',
        location: 'Mumbai, India',
        ip_address: '192.168.1.***',
        last_active: '2026-01-07T14:20:00Z',
        is_current: false
    },
    {
        id: 'session-3',
        device: 'iPhone 15',
        browser: 'Safari Mobile',
        location: 'Delhi, India',
        ip_address: '103.25.***',
        last_active: '2026-01-05T09:15:00Z',
        is_current: false
    }
];

export const MOCK_LINKED_PROVIDERS: LinkedProvider[] = [
    {
        provider: 'google',
        email: 'david.hoffman@gmail.com',
        connected_at: '2025-11-15T10:00:00Z',
        is_connected: true
    },
    {
        provider: 'github',
        email: 'dhoffman',
        connected_at: '2025-12-01T14:30:00Z',
        is_connected: true
    }
];

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
    in_app: true,
    email: true,
    mentions_only: false,
    digest_frequency: 'daily'
};

export const MOCK_COMMUNICATION_SETTINGS: CommunicationSettings = {
    who_can_message: 'team_only',
    dm_enabled: true,
    announcement_only_mode: false,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    message_retention: '90_days'
};

export const MOCK_BUILDERS: Profile[] = [
    {
        id: 'b1',
        full_name: 'Alex Rivers',
        role_type: 'builder',
        specialization: 'Frontend Lead',
        experience_years: 5,
        completion_score: 100,
        avatar_url: 'https://i.pravatar.cc/150?u=b1',
        github_url: 'github.com/arivers',
        linkedin_url: 'linkedin.com/in/arivers',
        is_verified: true,
        location: 'Berlin, DE',
        bio: 'Passionate about building highly performant React applications with focus on accessibility and user experience.'
    },
    {
        id: 'b2',
        full_name: 'Sarah Chen',
        role_type: 'builder',
        specialization: 'UI/UX Architect',
        experience_years: 3,
        completion_score: 85,
        avatar_url: 'https://i.pravatar.cc/150?u=b2',
        github_url: 'github.com/schen_design',
        linkedin_url: 'linkedin.com/in/sarahchen',
        is_verified: true,
        location: 'Toronto, CA',
        bio: 'Creating elegant solutions for complex problems. Specializing in design systems and micro-interactions.'
    },
    {
        id: 'b3',
        full_name: 'Marcus Thorne',
        role_type: 'builder',
        specialization: 'Backend Engineer',
        experience_years: 7,
        completion_score: 92,
        avatar_url: 'https://i.pravatar.cc/150?u=b3',
        github_url: 'github.com/mthorne_dev',
        is_verified: true,
        location: 'London, UK',
        bio: 'Rust and Go enthusiast. Scaling distributed systems and optimizing database performance.'
    },
    {
        id: 'b4',
        full_name: 'Elena Rodriguez',
        role_type: 'builder',
        specialization: 'Data Analyst',
        experience_years: 2,
        completion_score: 70,
        avatar_url: 'https://i.pravatar.cc/150?u=b4',
        linkedin_url: 'linkedin.com/in/erodriguez',
        is_verified: false,
        location: 'Madrid, ES',
        bio: 'Bridging the gap between raw data and actionable business insights using Python and SQL.'
    },
    {
        id: 'b5',
        full_name: 'Jason Kim',
        role_type: 'builder',
        specialization: 'Full Stack Dev',
        experience_years: 4,
        completion_score: 80,
        avatar_url: 'https://i.pravatar.cc/150?u=b5',
        github_url: 'github.com/jkimbuilds',
        is_verified: true,
        location: 'Seoul, KR',
        bio: 'Everything from CSS trickery to server-side logic. I love the Next.js ecosystem.'
    },
    {
        id: 'b6',
        full_name: 'Priya Sharma',
        role_type: 'builder',
        specialization: 'Mobile Developer',
        experience_years: 6,
        completion_score: 100,
        avatar_url: 'https://i.pravatar.cc/150?u=b6',
        github_url: 'github.com/psharma_mobile',
        linkedin_url: 'linkedin.com/in/priyasharma',
        is_verified: true,
        location: 'Bangalore, IN',
        bio: 'React Native expert. Shipping high-quality mobile experiences for global brands.'
    }
];

export const MOCK_FOUNDERS: Profile[] = [
    {
        id: 'f1',
        full_name: 'David Hoffman',
        role_type: 'founder',
        completion_score: 100,
        avatar_url: 'https://i.pravatar.cc/150?u=f1',
        is_verified: true,
        location: 'San Francisco, US',
        bio: 'Serial entrepreneur focusing on AI-driven productivity tools. Previously at YC S19.'
    },
    {
        id: 'f2',
        full_name: 'Linda Gao',
        role_type: 'founder',
        completion_score: 95,
        avatar_url: 'https://i.pravatar.cc/150?u=f2',
        is_verified: true,
        location: 'Singapore, SG',
        bio: 'Building the next generation of circular economy logistics. Passionate about sustainability.'
    },
    {
        id: 'f3',
        full_name: 'Samir Al-Fayed',
        role_type: 'founder',
        completion_score: 80,
        avatar_url: 'https://i.pravatar.cc/150?u=f3',
        is_verified: false,
        location: 'Dubai, UAE',
        bio: 'Disrupting the real estate market with blockchain-based fractional ownership.'
    }
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Nexus AI Resume Optimizer',
        description: 'Advanced NLP engine that helps job seekers match their profiles with enterprise requirements.',
        vision: 'To eliminate hiring bias and empower talent through transparent AI analysis.',
        sector: 'AI & Machine Learning',
        skills_needed: ['Next.js', 'Python', 'Tailwind CSS', 'OpenAI API'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-12-15T09:00:00Z',
        last_activity: '2026-01-05T08:30:00Z',
        open_roles: ['Backend Engineer', 'ML Engineer'],
        applications_pending: 3,
        imageUrl: '/projects/ai.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p2',
        title: 'HealTrack V2',
        description: 'Comprehensive healthcare appointment and patient management system for clinics.',
        vision: 'Modernizing patient care through intuitive digital workflows and data security.',
        sector: 'HealthTech',
        skills_needed: ['React Native', 'PostgreSQL', 'Node.js', 'HIPAA Compliance'],
        team_size_needed: 5,
        member_count: 5,
        status: 'in-progress',
        phase: 'review',
        commitment: 'high',
        created_at: '2025-11-20T14:30:00Z',
        last_activity: '2026-01-04T16:45:00Z',
        open_roles: [],
        applications_pending: 0,
        imageUrl: '/projects/health.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p3',
        title: 'EcoLogistics Hub',
        description: 'Tracking and optimization platform for sustainable supply chain movements.',
        vision: 'Reducing the carbon footprint of global logistics through smart routing.',
        sector: 'SaaS & Enterprise',
        skills_needed: ['TypeScript', 'Google Maps API', 'D3.js', 'Firebase'],
        team_size_needed: 3,
        member_count: 1,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2025-12-28T11:00:00Z',
        last_activity: '2026-01-03T14:20:00Z',
        open_roles: ['Frontend Developer', 'DevOps Engineer'],
        applications_pending: 2,
        imageUrl: '/projects/logistics.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p4',
        title: 'BitProperty Exchange',
        description: 'Decentralized platform for tokenizing high-value real estate assets.',
        vision: 'Democratizing real estate investment for everyone, everywhere.',
        sector: 'Web3 & Crypto',
        skills_needed: ['Solidity', 'Web3.js', 'Ethers.js', 'Framer Motion'],
        team_size_needed: 6,
        member_count: 3,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2026-01-02T16:45:00Z',
        last_activity: '2026-01-05T07:15:00Z',
        open_roles: ['Smart Contract Auditor', 'Frontend Lead', 'UX Designer'],
        applications_pending: 5,
        imageUrl: '/projects/blockchain.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p5',
        title: 'LearnLoop Community',
        description: 'Open-source platform for peer-to-peer technical mentorship and skill swapping.',
        vision: 'Building a world where learning is free, accessible, and community-driven.',
        sector: 'EdTech',
        skills_needed: ['React', 'Supabase', 'Express', 'Redis'],
        team_size_needed: 4,
        member_count: 4,
        status: 'closed',
        phase: 'completed',
        commitment: 'medium',
        created_at: '2025-10-05T08:15:00Z',
        last_activity: '2025-12-20T10:00:00Z',
        open_roles: [],
        applications_pending: 0,
        imageUrl: '/projects/education.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p6',
        title: 'SecureGate Auth',
        description: 'Next-gen biometric authentication layer for web applications.',
        vision: 'Making the internet safer by eliminating the password entirely.',
        sector: 'Cybersecurity',
        skills_needed: ['WebAuthn', 'C++', 'Wasm', 'Next.js'],
        team_size_needed: 3,
        member_count: 2,
        status: 'in-progress',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-12-10T15:20:00Z',
        last_activity: '2026-01-04T22:30:00Z',
        open_roles: ['Security Researcher'],
        applications_pending: 1,
        imageUrl: '/projects/security.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p7',
        title: 'FinFlow Dashboard',
        description: 'Simplified financial tracking for early-stage startup founders.',
        vision: 'Clarity in chaos. Manage your runway without a spreadsheet.',
        sector: 'FinTech',
        skills_needed: ['Stripe API', 'Plaid SDK', 'React', 'Tailwind'],
        team_size_needed: 2,
        member_count: 1,
        status: 'open',
        phase: 'idea',
        commitment: 'low',
        created_at: '2026-01-03T10:00:00Z',
        last_activity: '2026-01-05T06:00:00Z',
        open_roles: ['Full Stack Developer'],
        applications_pending: 4,
        imageUrl: '/projects/finance.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p8',
        title: 'OpenPort Portfolio',
        description: 'An open-source portfolio builder for developers to showcase their PRs and commits.',
        vision: 'Your work speaks louder than your resume.',
        sector: 'SaaS & Enterprise',
        skills_needed: ['GitHub API', 'Next.js', 'Prisma', 'Postgres'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2026-01-01T12:00:00Z',
        last_activity: '2026-01-04T18:00:00Z',
        open_roles: ['Backend Developer', 'DevOps'],
        applications_pending: 2,
        imageUrl: '/projects/logistics.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p9',
        title: 'GreenCart Marketplace',
        description: 'A sustainable e-commerce platform connecting eco-conscious consumers with ethical brands.',
        vision: 'Making sustainable shopping effortless and accessible to everyone.',
        sector: 'E-commerce',
        skills_needed: ['Next.js', 'Stripe', 'MongoDB', 'AWS'],
        team_size_needed: 5,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2026-01-05T09:00:00Z',
        last_activity: '2026-01-20T14:30:00Z',
        open_roles: ['Backend Developer', 'DevOps Engineer', 'Product Designer'],
        applications_pending: 7,
        imageUrl: '/projects/ecommerce.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p10',
        title: 'CodeMentor AI',
        description: 'AI-powered code review assistant that provides real-time feedback and learning resources.',
        vision: 'Accelerating developer growth through intelligent, personalized code coaching.',
        sector: 'AI & Machine Learning',
        skills_needed: ['Python', 'GPT-4 API', 'FastAPI', 'Docker'],
        team_size_needed: 3,
        member_count: 1,
        status: 'open',
        phase: 'idea',
        commitment: 'medium',
        created_at: '2026-01-10T11:00:00Z',
        last_activity: '2026-01-18T09:45:00Z',
        open_roles: ['ML Engineer', 'Frontend Developer'],
        applications_pending: 3,
        imageUrl: '/projects/ai.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p11',
        title: 'RemoteSync Pro',
        description: 'Async-first collaboration tool designed for distributed teams across time zones.',
        vision: 'Making remote work feel as connected as being in the same room.',
        sector: 'SaaS & Enterprise',
        skills_needed: ['React', 'Socket.io', 'PostgreSQL', 'Redis'],
        team_size_needed: 4,
        member_count: 3,
        status: 'in-progress',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-11-15T08:00:00Z',
        last_activity: '2026-01-19T16:20:00Z',
        open_roles: ['Senior Frontend Engineer'],
        applications_pending: 2,
        imageUrl: '/projects/logistics.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p12',
        title: 'NutriTrack Mobile',
        description: 'Smart nutrition tracking app with AI meal recognition and personalized diet plans.',
        vision: 'Empowering healthier eating habits through intelligent food tracking.',
        sector: 'HealthTech',
        skills_needed: ['React Native', 'TensorFlow Lite', 'Firebase', 'Node.js'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2026-01-08T14:00:00Z',
        last_activity: '2026-01-21T10:30:00Z',
        open_roles: ['Mobile Developer', 'ML Engineer'],
        applications_pending: 5,
        imageUrl: '/projects/health.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p13',
        title: 'EventChain Tickets',
        description: 'NFT-based event ticketing platform preventing scalping and counterfeits.',
        vision: 'Bringing transparency and fairness back to event ticketing.',
        sector: 'Web3 & Crypto',
        skills_needed: ['Solidity', 'React', 'The Graph', 'IPFS'],
        team_size_needed: 5,
        member_count: 3,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-12-20T10:00:00Z',
        last_activity: '2026-01-17T11:45:00Z',
        open_roles: ['Smart Contract Developer', 'Product Manager'],
        applications_pending: 4,
        imageUrl: '/projects/blockchain.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p14',
        title: 'SkillBridge Academy',
        description: 'Cohort-based learning platform connecting industry experts with upskilling professionals.',
        vision: 'Bridging the gap between theoretical education and industry demands.',
        sector: 'EdTech',
        skills_needed: ['Next.js', 'Prisma', 'Stripe', 'WebRTC'],
        team_size_needed: 6,
        member_count: 4,
        status: 'in-progress',
        phase: 'review',
        commitment: 'high',
        created_at: '2025-10-01T09:00:00Z',
        last_activity: '2026-01-20T08:15:00Z',
        open_roles: ['QA Engineer', 'Content Strategist'],
        applications_pending: 1,
        imageUrl: '/projects/education.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p15',
        title: 'CloudVault Backup',
        description: 'End-to-end encrypted cloud backup solution for small businesses.',
        vision: 'Enterprise-grade data protection accessible to every business.',
        sector: 'Cybersecurity',
        skills_needed: ['Go', 'AWS S3', 'Cryptography', 'React'],
        team_size_needed: 3,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'medium',
        created_at: '2025-12-05T13:00:00Z',
        last_activity: '2026-01-16T15:30:00Z',
        open_roles: ['Backend Engineer'],
        applications_pending: 2,
        imageUrl: '/projects/security.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p16',
        title: 'InvoiceFlow Pro',
        description: 'Automated invoicing and payment tracking for freelancers and small agencies.',
        vision: 'Simplifying the business side of freelancing so you can focus on your craft.',
        sector: 'FinTech',
        skills_needed: ['Vue.js', 'Node.js', 'Stripe Connect', 'MongoDB'],
        team_size_needed: 3,
        member_count: 1,
        status: 'open',
        phase: 'idea',
        commitment: 'low',
        created_at: '2026-01-12T16:00:00Z',
        last_activity: '2026-01-19T12:00:00Z',
        open_roles: ['Full Stack Developer', 'UI Designer'],
        applications_pending: 6,
        imageUrl: '/projects/finance.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    // Additional projects to fill grids
    {
        id: 'p17',
        title: 'ThreatShield Monitor',
        description: 'Real-time threat detection and security monitoring for enterprise networks.',
        vision: 'Proactive cybersecurity that stays one step ahead of attackers.',
        sector: 'Cybersecurity',
        skills_needed: ['Python', 'Elasticsearch', 'Machine Learning', 'Docker'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2026-01-08T10:00:00Z',
        last_activity: '2026-01-22T14:00:00Z',
        open_roles: ['ML Engineer', 'Security Analyst'],
        applications_pending: 4,
        imageUrl: '/projects/security.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p18',
        title: 'ZeroTrust Portal',
        description: 'Zero-trust access management for distributed workforce security.',
        vision: 'Every access is verified, every connection is secure.',
        sector: 'Cybersecurity',
        skills_needed: ['OAuth2', 'Kubernetes', 'Rust', 'PostgreSQL'],
        team_size_needed: 3,
        member_count: 1,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2026-01-15T09:00:00Z',
        last_activity: '2026-01-25T11:30:00Z',
        open_roles: ['Backend Developer', 'DevOps Engineer'],
        applications_pending: 3,
        imageUrl: '/projects/security.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p19',
        title: 'PhishGuard AI',
        description: 'AI-powered email security that detects phishing attempts before they reach users.',
        vision: 'Eliminating social engineering attacks with intelligent protection.',
        sector: 'Cybersecurity',
        skills_needed: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-11-20T08:00:00Z',
        last_activity: '2026-01-20T16:45:00Z',
        open_roles: ['ML Engineer', 'Frontend Developer'],
        applications_pending: 5,
        imageUrl: '/projects/security.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p20',
        title: 'CryptoWallet Shield',
        description: 'Multi-signature wallet with advanced fraud detection for crypto assets.',
        vision: 'Your crypto assets secured by next-gen protection.',
        sector: 'Cybersecurity',
        skills_needed: ['Solidity', 'Web3.js', 'Node.js', 'React'],
        team_size_needed: 3,
        member_count: 2,
        status: 'in-progress',
        phase: 'review',
        commitment: 'high',
        created_at: '2025-12-01T11:00:00Z',
        last_activity: '2026-01-18T09:20:00Z',
        open_roles: ['Smart Contract Auditor'],
        applications_pending: 2,
        imageUrl: '/projects/security.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p21',
        title: 'WealthPath Advisor',
        description: 'AI-driven personalized investment recommendations for retail investors.',
        vision: 'Professional-grade wealth management for everyone.',
        sector: 'FinTech',
        skills_needed: ['Python', 'React', 'TensorFlow', 'PostgreSQL'],
        team_size_needed: 5,
        member_count: 3,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2026-01-05T14:00:00Z',
        last_activity: '2026-01-24T10:00:00Z',
        open_roles: ['ML Engineer', 'Backend Developer'],
        applications_pending: 8,
        imageUrl: '/projects/finance.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p22',
        title: 'CreditScore Plus',
        description: 'Alternative credit scoring using transaction data and behavioral analytics.',
        vision: 'Fair credit access for the underbanked population.',
        sector: 'FinTech',
        skills_needed: ['Python', 'Spark', 'AWS', 'React Native'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2026-01-10T08:30:00Z',
        last_activity: '2026-01-23T15:00:00Z',
        open_roles: ['Data Scientist', 'Mobile Developer'],
        applications_pending: 4,
        imageUrl: '/projects/finance.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p23',
        title: 'StudyBuddy AI',
        description: 'Personalized study assistant that adapts to individual learning styles.',
        vision: 'Every student learns at their own pace with AI guidance.',
        sector: 'EdTech',
        skills_needed: ['Python', 'React', 'OpenAI API', 'MongoDB'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'medium',
        created_at: '2026-01-06T10:00:00Z',
        last_activity: '2026-01-21T12:30:00Z',
        open_roles: ['ML Engineer', 'UX Designer'],
        applications_pending: 5,
        imageUrl: '/projects/education.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p24',
        title: 'CampusConnect',
        description: 'Social learning network connecting students across universities globally.',
        vision: 'Break down academic silos and foster global collaboration.',
        sector: 'EdTech',
        skills_needed: ['Next.js', 'Firebase', 'WebRTC', 'Tailwind'],
        team_size_needed: 5,
        member_count: 3,
        status: 'in-progress',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-11-10T09:00:00Z',
        last_activity: '2026-01-22T18:00:00Z',
        open_roles: ['Frontend Lead', 'Backend Developer'],
        applications_pending: 3,
        imageUrl: '/projects/education.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p25',
        title: 'MedAssist Patient',
        description: 'AI symptom checker and health tracking for informed patient decisions.',
        vision: 'Empowering patients with knowledge before doctor visits.',
        sector: 'HealthTech',
        skills_needed: ['React Native', 'Python', 'FHIR', 'AWS'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2026-01-02T11:00:00Z',
        last_activity: '2026-01-19T14:30:00Z',
        open_roles: ['ML Engineer', 'Mobile Developer'],
        applications_pending: 6,
        imageUrl: '/projects/health.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
    {
        id: 'p26',
        title: 'ClinicFlow EHR',
        description: 'Lightweight electronic health records for small medical practices.',
        vision: 'Enterprise EHR capabilities without enterprise complexity.',
        sector: 'HealthTech',
        skills_needed: ['React', 'Node.js', 'PostgreSQL', 'HIPAA'],
        team_size_needed: 4,
        member_count: 3,
        status: 'in-progress',
        phase: 'review',
        commitment: 'high',
        created_at: '2025-10-15T08:00:00Z',
        last_activity: '2026-01-18T11:00:00Z',
        open_roles: ['Security Engineer'],
        applications_pending: 2,
        imageUrl: '/projects/health.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p27',
        title: 'TokenGate Events',
        description: 'NFT-gated exclusive experiences and community access for brands.',
        vision: 'Unlocking premium experiences through digital ownership.',
        sector: 'Web3 & Crypto',
        skills_needed: ['Solidity', 'React', 'IPFS', 'Node.js'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'active',
        commitment: 'medium',
        created_at: '2026-01-07T15:00:00Z',
        last_activity: '2026-01-23T09:45:00Z',
        open_roles: ['Smart Contract Dev', 'Frontend Developer'],
        applications_pending: 4,
        imageUrl: '/projects/blockchain.png',
        founder: { id: 'f3', name: 'Samir Al-Fayed' }
    },
    {
        id: 'p28',
        title: 'DeFi Yield Hub',
        description: 'Aggregated yield optimization across multiple DeFi protocols.',
        vision: 'Maximize returns while minimizing DeFi complexity.',
        sector: 'Web3 & Crypto',
        skills_needed: ['Solidity', 'TypeScript', 'The Graph', 'Ethers.js'],
        team_size_needed: 5,
        member_count: 3,
        status: 'open',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-12-20T12:00:00Z',
        last_activity: '2026-01-21T16:30:00Z',
        open_roles: ['DeFi Strategist', 'Security Auditor'],
        applications_pending: 7,
        imageUrl: '/projects/blockchain.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p29',
        title: 'TeamSync Enterprise',
        description: 'Team coordination platform with smart scheduling and async communication.',
        vision: 'Teams that work smarter, not harder.',
        sector: 'SaaS & Enterprise',
        skills_needed: ['React', 'GraphQL', 'PostgreSQL', 'Redis'],
        team_size_needed: 5,
        member_count: 4,
        status: 'in-progress',
        phase: 'active',
        commitment: 'high',
        created_at: '2025-09-15T10:00:00Z',
        last_activity: '2026-01-24T08:00:00Z',
        open_roles: ['Senior Frontend Engineer'],
        applications_pending: 3,
        imageUrl: '/projects/logistics.png',
        founder: { id: 'f1', name: 'David Hoffman' }
    },
    {
        id: 'p30',
        title: 'DataPipeline Pro',
        description: 'No-code data integration and ETL platform for business analysts.',
        vision: 'Data engineering power without coding complexity.',
        sector: 'SaaS & Enterprise',
        skills_needed: ['Python', 'Apache Airflow', 'React', 'PostgreSQL'],
        team_size_needed: 4,
        member_count: 2,
        status: 'open',
        phase: 'planning',
        commitment: 'medium',
        created_at: '2026-01-09T14:00:00Z',
        last_activity: '2026-01-22T10:15:00Z',
        open_roles: ['Data Engineer', 'Frontend Developer'],
        applications_pending: 5,
        imageUrl: '/projects/logistics.png',
        founder: { id: 'f2', name: 'Linda Gao' }
    },
];

// User applications (for builder dashboard)
export const MOCK_USER_APPLICATIONS: Application[] = [
    {
        id: 'ua1',
        project_id: 'p1',
        project_title: 'Nexus AI Resume Optimizer',
        applicant_id: 'b1',
        applicant_name: 'Alex Rivers',
        role_applied: 'Frontend Lead',
        status: 'accepted',
        applied_at: '2025-12-18T10:00:00Z'
    },
    {
        id: 'ua2',
        project_id: 'p4',
        project_title: 'BitProperty Exchange',
        applicant_id: 'b1',
        applicant_name: 'Alex Rivers',
        role_applied: 'Frontend Lead',
        status: 'pending',
        applied_at: '2026-01-02T14:30:00Z',
        action_required: true
    },
    {
        id: 'ua3',
        project_id: 'p7',
        project_title: 'FinFlow Dashboard',
        applicant_id: 'b1',
        applicant_name: 'Alex Rivers',
        role_applied: 'Full Stack Developer',
        status: 'pending',
        applied_at: '2026-01-04T09:15:00Z'
    },
    {
        id: 'ua4',
        project_id: 'p3',
        project_title: 'EcoLogistics Hub',
        applicant_id: 'b1',
        applicant_name: 'Alex Rivers',
        role_applied: 'Frontend Developer',
        status: 'rejected',
        applied_at: '2025-12-30T11:00:00Z'
    }
];

// Incoming applications for founders
export const MOCK_INCOMING_APPLICATIONS: Application[] = [
    {
        id: 'ia1',
        project_id: 'p1',
        project_title: 'Nexus AI Resume Optimizer',
        applicant_id: 'b4',
        applicant_name: 'Elena Rodriguez',
        applicant_avatar: 'https://i.pravatar.cc/150?u=b4',
        role_applied: 'Data Analyst',
        status: 'pending',
        applied_at: '2026-01-04T14:00:00Z'
    },
    {
        id: 'ia2',
        project_id: 'p1',
        project_title: 'Nexus AI Resume Optimizer',
        applicant_id: 'b3',
        applicant_name: 'Marcus Thorne',
        applicant_avatar: 'https://i.pravatar.cc/150?u=b3',
        role_applied: 'Backend Engineer',
        status: 'pending',
        applied_at: '2026-01-05T08:30:00Z'
    },
    {
        id: 'ia3',
        project_id: 'p8',
        project_title: 'OpenPort Portfolio',
        applicant_id: 'b5',
        applicant_name: 'Jason Kim',
        applicant_avatar: 'https://i.pravatar.cc/150?u=b5',
        role_applied: 'Full Stack Dev',
        status: 'pending',
        applied_at: '2026-01-03T16:20:00Z'
    },
    {
        id: 'ia4',
        project_id: 'p8',
        project_title: 'OpenPort Portfolio',
        applicant_id: 'b6',
        applicant_name: 'Priya Sharma',
        applicant_avatar: 'https://i.pravatar.cc/150?u=b6',
        role_applied: 'DevOps Engineer',
        status: 'pending',
        applied_at: '2026-01-04T11:45:00Z'
    }
];

// Team members for founder dashboard
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'tm1',
        user_id: 'f1',
        name: 'David Hoffman',
        avatar_url: 'https://i.pravatar.cc/150?u=f1',
        role: 'Project Lead',
        role_badge: 'founder',
        project_role: 'founder',
        joined_at: '2025-12-15T09:00:00Z',
        project_id: 'p1',
        status: 'active'
    },
    {
        id: 'tm2',
        user_id: 'b1',
        name: 'Alex Rivers',
        avatar_url: 'https://i.pravatar.cc/150?u=b1',
        role: 'Frontend Lead',
        role_badge: 'lead',
        project_role: 'team_lead',
        joined_at: '2025-12-20T10:00:00Z',
        project_id: 'p1',
        status: 'active'
    },
    {
        id: 'tm3',
        user_id: 'b2',
        name: 'Sarah Chen',
        avatar_url: 'https://i.pravatar.cc/150?u=b2',
        role: 'UI/UX Designer',
        role_badge: 'designer',
        project_role: 'contributor',
        joined_at: '2025-12-22T14:30:00Z',
        project_id: 'p1',
        status: 'active'
    },
    {
        id: 'tm4',
        user_id: 'f1',
        name: 'David Hoffman',
        avatar_url: 'https://i.pravatar.cc/150?u=f1',
        role: 'Project Lead',
        role_badge: 'founder',
        project_role: 'founder',
        joined_at: '2026-01-01T12:00:00Z',
        project_id: 'p8',
        status: 'active'
    },
    {
        id: 'tm5',
        user_id: 'b3',
        name: 'Marcus Thorne',
        avatar_url: 'https://i.pravatar.cc/150?u=b3',
        role: 'Backend Engineer',
        role_badge: 'developer',
        project_role: 'contributor',
        joined_at: '2026-01-02T09:00:00Z',
        project_id: 'p8',
        status: 'active'
    }
];

// Active projects for user dashboard
export const MOCK_ACTIVE_PROJECTS = [
    {
        id: 'ap1',
        project_id: 'p1',
        project_title: 'Nexus AI Resume Optimizer',
        role: 'Frontend Lead',
        status: 'active' as const,
        phase: 'active' as const,
        last_activity: '2026-01-05T08:30:00Z',
        founder_name: 'David Hoffman',
        imageUrl: '/projects/ai.png'
    },
    {
        id: 'ap2',
        project_id: 'p6',
        project_title: 'SecureGate Auth',
        role: 'Frontend Developer',
        status: 'active' as const,
        phase: 'active' as const,
        last_activity: '2026-01-04T22:30:00Z',
        founder_name: 'Samir Al-Fayed',
        imageUrl: '/projects/security.png'
    },
    {
        id: 'ap3',
        project_id: 'p5',
        project_title: 'LearnLoop Community',
        role: 'UI Engineer',
        status: 'archived' as const,
        phase: 'completed' as const,
        last_activity: '2025-12-20T10:00:00Z',
        founder_name: 'David Hoffman',
        imageUrl: '/projects/education.png'
    }
];

export const MOCK_ROOMS: ChatRoom[] = [
    // Project channels
    {
        id: 'r1',
        name: 'Nexus AI Project',
        type: 'project',
        project_id: 'p1',
        project_name: 'Nexus AI Resume Optimizer',
        last_message: 'API integration tests passing now.',
        last_message_time: '2026-01-05T08:45:00Z',
        unread_count: 3,
        updated_at: '2026-01-05T08:45:00Z',
        members_count: 4
    },
    {
        id: 'r2',
        name: 'HealTrack Development',
        type: 'project',
        project_id: 'p2',
        project_name: 'HealTrack V2',
        last_message: 'HIPAA module passed audit.',
        last_message_time: '2026-01-04T18:20:00Z',
        unread_count: 0,
        updated_at: '2026-01-04T18:20:00Z',
        members_count: 5
    },
    {
        id: 'r7',
        name: 'BitProperty Exchange',
        type: 'project',
        project_id: 'p4',
        project_name: 'BitProperty Exchange',
        last_message: 'Smart contract deployed to testnet.',
        last_message_time: '2026-01-05T07:30:00Z',
        unread_count: 5,
        updated_at: '2026-01-05T07:30:00Z',
        members_count: 3
    },
    {
        id: 'r8',
        name: 'SecureGate Auth',
        type: 'project',
        project_id: 'p6',
        project_name: 'SecureGate Auth',
        last_message: 'WebAuthn implementation complete.',
        last_message_time: '2026-01-04T22:30:00Z',
        unread_count: 1,
        updated_at: '2026-01-04T22:30:00Z',
        members_count: 2
    },
    {
        id: 'r9',
        name: 'OpenPort Portfolio',
        type: 'project',
        project_id: 'p8',
        project_name: 'OpenPort Portfolio',
        last_message: 'GitHub OAuth working.',
        last_message_time: '2026-01-04T18:00:00Z',
        unread_count: 0,
        updated_at: '2026-01-04T18:00:00Z',
        members_count: 2
    },
    // Direct messages
    {
        id: 'r3',
        name: 'David Hoffman',
        type: 'direct',
        last_message: 'Welcome to the team, Alex!',
        last_message_time: '2026-01-04T10:15:00Z',
        unread_count: 0,
        updated_at: '2026-01-04T10:15:00Z'
    },
    {
        id: 'r4',
        name: 'Sarah Chen',
        type: 'direct',
        last_message: 'Designs are in Figma. Check when ready.',
        last_message_time: '2026-01-04T12:30:00Z',
        unread_count: 2,
        updated_at: '2026-01-04T12:30:00Z'
    },
    {
        id: 'r5',
        name: 'Marcus Thorne',
        type: 'direct',
        last_message: 'Database migration complete.',
        last_message_time: '2026-01-04T14:00:00Z',
        unread_count: 0,
        updated_at: '2026-01-04T14:00:00Z'
    },
    {
        id: 'r6',
        name: 'Linda Gao',
        type: 'direct',
        last_message: 'Meeting scheduled for Monday.',
        last_message_time: '2026-01-02T09:00:00Z',
        unread_count: 0,
        updated_at: '2026-01-02T09:00:00Z'
    },
    {
        id: 'r10',
        name: 'Priya Sharma',
        type: 'direct',
        last_message: 'Push notifications are live now.',
        last_message_time: '2026-01-03T16:45:00Z',
        unread_count: 1,
        updated_at: '2026-01-03T16:45:00Z'
    }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    'r1': [
        { id: 'm1', room_id: 'r1', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Project Lead', content: 'Team, we need to finalize the MVP scope by Friday. Please review the requirements doc I shared.', created_at: '2026-01-04T10:00:00Z', is_read: true },
        { id: 'm2', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'Working on the landing page auth flow now. Should be ready for review tomorrow.', created_at: '2026-01-04T10:15:00Z', is_read: true },
        { id: 'm3', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'Also updated the component library with the new design tokens.', created_at: '2026-01-04T10:16:00Z', is_read: true },
        { id: 'm4', room_id: 'r1', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'UI/UX Designer', content: 'Great work on the tokens. The Figma file is updated with all the latest screens.', created_at: '2026-01-04T10:30:00Z', is_read: true },
        { id: 'm5', room_id: 'r1', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Project Lead', content: 'Perfect. Let me know if you need any clarification on the user flow.', created_at: '2026-01-04T11:00:00Z', is_read: true },
        { id: 'm6', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'One question - should the resume parser handle PDF files only or also DOCX?', created_at: '2026-01-04T14:00:00Z', is_read: true },
        { id: 'm7', room_id: 'r1', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Project Lead', content: 'Both formats. We need to support the most common resume formats. DOCX, PDF, and plain text.', created_at: '2026-01-04T14:05:00Z', is_read: true },
        { id: 'm8', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'Got it. Will update the file upload component.', created_at: '2026-01-04T14:10:00Z', is_read: true },
        { id: 'm9', room_id: 'r1', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'UI/UX Designer', content: 'I added some error state designs for invalid file formats.', created_at: '2026-01-04T15:30:00Z', is_read: true },
        { id: 'm10', room_id: 'r1', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Project Lead', content: 'Sprint planning tomorrow at 10 AM. Please be prepared with your updates.', created_at: '2026-01-04T17:00:00Z', is_read: true },
        { id: 'm11', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'Will be there. Just pushed the latest changes to staging.', created_at: '2026-01-04T18:00:00Z', is_read: true },
        { id: 'm12', room_id: 'r1', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Project Lead', content: 'Morning team. Ready for the sprint planning call?', created_at: '2026-01-05T09:55:00Z', is_read: true },
        { id: 'm13', room_id: 'r1', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'UI/UX Designer', content: 'Yes, joining now.', created_at: '2026-01-05T09:58:00Z', is_read: true },
        { id: 'm14', room_id: 'r1', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Lead', content: 'API integration tests passing now.', created_at: '2026-01-05T08:45:00Z', is_read: false }
    ],
    'r3': [
        { id: 'm15', room_id: 'r3', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Founder', content: 'Hey Alex, saw your work on the dashboard. Impressive speed.', created_at: '2026-01-04T08:00:00Z', is_read: true },
        { id: 'm16', room_id: 'r3', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Developer', content: 'Thanks David! Just cleaning up some state management logic.', created_at: '2026-01-04T09:15:00Z', is_read: true },
        { id: 'm17', room_id: 'r3', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Founder', content: 'Your attention to detail is exactly what this project needs.', created_at: '2026-01-04T09:30:00Z', is_read: true },
        { id: 'm18', room_id: 'r3', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Founder', content: 'Welcome to the team, Alex!', created_at: '2026-01-04T10:15:00Z', is_read: true }
    ],
    'r4': [
        { id: 'm19', room_id: 'r4', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'Designer', content: 'Hey! Quick question about the color palette.', created_at: '2026-01-04T11:00:00Z', is_read: true },
        { id: 'm20', room_id: 'r4', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Developer', content: 'Sure, what do you need?', created_at: '2026-01-04T11:05:00Z', is_read: true },
        { id: 'm21', room_id: 'r4', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'Designer', content: 'Should we use the primary blue for CTAs or the gradient version?', created_at: '2026-01-04T11:10:00Z', is_read: true },
        { id: 'm22', room_id: 'r4', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Developer', content: 'I think solid blue works better for accessibility. Gradients can have contrast issues.', created_at: '2026-01-04T11:15:00Z', is_read: true },
        { id: 'm23', room_id: 'r4', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'Designer', content: 'Good point. Will update the design system.', created_at: '2026-01-04T11:20:00Z', is_read: true },
        { id: 'm24', room_id: 'r4', sender_id: 'b2', sender_name: 'Sarah Chen', sender_role: 'user', sender_role_title: 'Designer', content: 'Designs are in Figma. Check when ready.', created_at: '2026-01-04T12:30:00Z', is_read: false }
    ],
    'r7': [
        { id: 'm25', room_id: 'r7', sender_id: 'f3', sender_name: 'Samir Al-Fayed', sender_role: 'founder', sender_role_title: 'Founder', content: 'Team, we have a big update. The legal framework for tokenization is approved.', created_at: '2026-01-04T09:00:00Z', is_read: true },
        { id: 'm26', room_id: 'r7', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Engineer', content: 'Excellent news! I can now finalize the smart contract architecture.', created_at: '2026-01-04T09:15:00Z', is_read: true },
        { id: 'm27', room_id: 'r7', sender_id: 'f3', sender_name: 'Samir Al-Fayed', sender_role: 'founder', sender_role_title: 'Founder', content: 'Please prioritize the escrow functionality. That is critical for our first release.', created_at: '2026-01-04T09:20:00Z', is_read: true },
        { id: 'm28', room_id: 'r7', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Engineer', content: 'Will do. I estimate 3 days for the escrow contract.', created_at: '2026-01-04T09:25:00Z', is_read: true },
        { id: 'm29', room_id: 'r7', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Engineer', content: 'Also need to discuss gas optimization strategies.', created_at: '2026-01-04T09:26:00Z', is_read: true },
        { id: 'm30', room_id: 'r7', sender_id: 'f3', sender_name: 'Samir Al-Fayed', sender_role: 'founder', sender_role_title: 'Founder', content: 'Let us schedule a call tomorrow.', created_at: '2026-01-04T09:30:00Z', is_read: true },
        { id: 'm31', room_id: 'r7', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Engineer', content: 'Smart contract deployed to testnet.', created_at: '2026-01-05T07:30:00Z', is_read: false }
    ],
    'r8': [
        { id: 'm32', room_id: 'r8', sender_id: 'f3', sender_name: 'Samir Al-Fayed', sender_role: 'founder', sender_role_title: 'Founder', content: 'How is the WebAuthn integration coming along?', created_at: '2026-01-04T16:00:00Z', is_read: true },
        { id: 'm33', room_id: 'r8', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Developer', content: 'Good progress. The browser support is tricky but manageable.', created_at: '2026-01-04T16:30:00Z', is_read: true },
        { id: 'm34', room_id: 'r8', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Developer', content: 'Safari requires some polyfills.', created_at: '2026-01-04T16:31:00Z', is_read: true },
        { id: 'm35', room_id: 'r8', sender_id: 'f3', sender_name: 'Samir Al-Fayed', sender_role: 'founder', sender_role_title: 'Founder', content: 'Whatever it takes. Security cannot be compromised.', created_at: '2026-01-04T17:00:00Z', is_read: true },
        { id: 'm36', room_id: 'r8', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Frontend Developer', content: 'WebAuthn implementation complete.', created_at: '2026-01-04T22:30:00Z', is_read: false }
    ],
    'r5': [
        { id: 'm37', room_id: 'r5', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Engineer', content: 'Hey, quick sync on the API schema?', created_at: '2026-01-04T13:00:00Z', is_read: true },
        { id: 'm38', room_id: 'r5', sender_id: 'b1', sender_name: 'Alex Rivers', sender_role: 'user', sender_role_title: 'Developer', content: 'Sure. What is the endpoint structure?', created_at: '2026-01-04T13:10:00Z', is_read: true },
        { id: 'm39', room_id: 'r5', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Engineer', content: 'I will send you the OpenAPI spec in a minute.', created_at: '2026-01-04T13:15:00Z', is_read: true },
        { id: 'm40', room_id: 'r5', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Engineer', content: 'Database migration complete.', created_at: '2026-01-04T14:00:00Z', is_read: true }
    ],
    'r9': [
        { id: 'm41', room_id: 'r9', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Founder', content: 'OpenPort is gaining traction. 50 signups this week.', created_at: '2026-01-04T15:00:00Z', is_read: true },
        { id: 'm42', room_id: 'r9', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Developer', content: 'That is great! The GitHub integration is working smoothly.', created_at: '2026-01-04T15:30:00Z', is_read: true },
        { id: 'm43', room_id: 'r9', sender_id: 'f1', sender_name: 'David Hoffman', sender_role: 'founder', sender_role_title: 'Founder', content: 'Can we add GitLab support next sprint?', created_at: '2026-01-04T16:00:00Z', is_read: true },
        { id: 'm44', room_id: 'r9', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Developer', content: 'Yes, I can scope that out. Similar OAuth flow.', created_at: '2026-01-04T16:15:00Z', is_read: true },
        { id: 'm45', room_id: 'r9', sender_id: 'b3', sender_name: 'Marcus Thorne', sender_role: 'user', sender_role_title: 'Backend Developer', content: 'GitHub OAuth working.', created_at: '2026-01-04T18:00:00Z', is_read: true }
    ]
};

export const MOCK_NOTIFICATIONS = [
    { id: 'n1', type: 'success', text: 'Application accepted for Nexus AI Resume Optimizer', time: '2h ago', read: false },
    { id: 'n2', type: 'message', text: 'New message from David Hoffman', time: '5h ago', read: false },
    { id: 'n3', type: 'info', text: 'Profile verification pending review', time: '1d ago', read: true },
    { id: 'n4', type: 'warning', text: 'Complete your profile to apply for projects', time: '2d ago', read: true }
];

export const MOCK_METRICS = {
    builder: {
        projects_joined: 3,
        applications_sent: 4,
        pending_requests: 2,
        active_chats: 5
    },
    founder: {
        total_projects: 3,
        active_members: 5,
        pending_applicants: 4,
        uptime_percentage: 99.9
    }
};

// Helper for relative time
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ===== ANNOUNCEMENTS =====
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ann1',
        project_id: 'p1',
        author_id: 'f1',
        author_name: 'David Hoffman',
        author_role: 'founder',
        content: 'Sprint planning scheduled for Monday 10 AM. All team members required to attend.',
        created_at: '2026-01-05T08:00:00Z',
        is_pinned: true
    },
    {
        id: 'ann2',
        project_id: 'p1',
        author_id: 'f1',
        author_name: 'David Hoffman',
        author_role: 'founder',
        content: 'MVP scope finalized. Focus on core features only for V1 release.',
        created_at: '2026-01-04T15:00:00Z',
        is_pinned: true
    },
    {
        id: 'ann3',
        project_id: 'p4',
        author_id: 'f3',
        author_name: 'Samir Al-Fayed',
        author_role: 'founder',
        content: 'Legal framework approved. We can proceed with smart contract deployment.',
        created_at: '2026-01-04T09:00:00Z',
        is_pinned: true
    },
    {
        id: 'ann4',
        project_id: 'p6',
        author_id: 'f3',
        author_name: 'Samir Al-Fayed',
        author_role: 'founder',
        content: 'Security audit scheduled for next week. Prepare all documentation.',
        created_at: '2026-01-03T14:00:00Z',
        is_pinned: false
    },
    {
        id: 'ann5',
        project_id: 'p8',
        author_id: 'f1',
        author_name: 'David Hoffman',
        author_role: 'founder',
        content: 'GitLab integration planned for next sprint. GitHub OAuth now live.',
        created_at: '2026-01-04T17:00:00Z',
        is_pinned: true
    },
    {
        id: 'ann6',
        project_id: 'p1',
        author_id: 'b1',
        author_name: 'Alex Rivers',
        author_role: 'team_lead',
        content: 'Design system updated. Please pull latest from main before starting work.',
        created_at: '2026-01-03T10:00:00Z',
        is_pinned: false
    }
];

// ===== ACTIVITY TIMELINE =====
export const MOCK_ACTIVITY_TIMELINE: ActivityEntry[] = [
    {
        id: 'act1',
        project_id: 'p1',
        type: 'member_joined',
        actor_id: 'b1',
        actor_name: 'Alex Rivers',
        description: 'Alex Rivers joined the project as Frontend Lead',
        timestamp: '2025-12-20T10:00:00Z'
    },
    {
        id: 'act2',
        project_id: 'p1',
        type: 'role_assigned',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        target_id: 'b1',
        target_name: 'Alex Rivers',
        description: 'David Hoffman assigned Team Lead role to Alex Rivers',
        timestamp: '2025-12-21T09:00:00Z'
    },
    {
        id: 'act3',
        project_id: 'p1',
        type: 'member_joined',
        actor_id: 'b2',
        actor_name: 'Sarah Chen',
        description: 'Sarah Chen joined the project as UI/UX Designer',
        timestamp: '2025-12-22T14:30:00Z'
    },
    {
        id: 'act4',
        project_id: 'p1',
        type: 'status_changed',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        description: 'Project status changed from Planning to Active',
        timestamp: '2025-12-28T09:00:00Z'
    },
    {
        id: 'act5',
        project_id: 'p1',
        type: 'application_approved',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        target_id: 'b1',
        target_name: 'Alex Rivers',
        description: 'David Hoffman approved application from Alex Rivers',
        timestamp: '2025-12-18T10:30:00Z'
    },
    {
        id: 'act6',
        project_id: 'p1',
        type: 'announcement_posted',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        description: 'David Hoffman posted a team announcement',
        timestamp: '2026-01-05T08:00:00Z'
    },
    {
        id: 'act7',
        project_id: 'p4',
        type: 'status_changed',
        actor_id: 'f3',
        actor_name: 'Samir Al-Fayed',
        description: 'Project status changed from Planning to Active',
        timestamp: '2026-01-02T16:45:00Z'
    },
    {
        id: 'act8',
        project_id: 'p4',
        type: 'member_joined',
        actor_id: 'b3',
        actor_name: 'Marcus Thorne',
        description: 'Marcus Thorne joined the project as Backend Engineer',
        timestamp: '2026-01-03T09:00:00Z'
    },
    {
        id: 'act9',
        project_id: 'p8',
        type: 'member_joined',
        actor_id: 'b3',
        actor_name: 'Marcus Thorne',
        description: 'Marcus Thorne joined the project as Backend Developer',
        timestamp: '2026-01-02T09:00:00Z'
    },
    {
        id: 'act10',
        project_id: 'p6',
        type: 'status_changed',
        actor_id: 'f3',
        actor_name: 'Samir Al-Fayed',
        description: 'Project status changed from Idea to Active',
        timestamp: '2025-12-10T15:20:00Z'
    },
    {
        id: 'act11',
        project_id: 'p5',
        type: 'status_changed',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        description: 'Project status changed from Active to Completed',
        timestamp: '2025-12-20T10:00:00Z'
    },
    {
        id: 'act12',
        project_id: 'p2',
        type: 'status_changed',
        actor_id: 'f2',
        actor_name: 'Linda Gao',
        description: 'Project status changed from Active to Review',
        timestamp: '2026-01-04T16:45:00Z'
    },
    {
        id: 'act13',
        project_id: 'p1',
        type: 'application_rejected',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        target_id: 'b4',
        target_name: 'Elena Rodriguez',
        description: 'Application from Elena Rodriguez was declined',
        timestamp: '2025-12-30T11:30:00Z'
    },
    {
        id: 'act14',
        project_id: 'p8',
        type: 'announcement_posted',
        actor_id: 'f1',
        actor_name: 'David Hoffman',
        description: 'David Hoffman posted a team announcement about GitLab integration',
        timestamp: '2026-01-04T17:00:00Z'
    },
    {
        id: 'act15',
        project_id: 'p3',
        type: 'status_changed',
        actor_id: 'f2',
        actor_name: 'Linda Gao',
        description: 'Project status changed from Idea to Planning',
        timestamp: '2025-12-28T11:00:00Z'
    }
];

