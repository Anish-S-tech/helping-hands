'use client';

import { useState } from 'react';
import { AlertTriangle, Lock, Loader2, X } from 'lucide-react';
import { Modal } from './ui/Modal';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => Promise<{ error: Error | null }>;
}

export function DeleteAccountModal({
    isOpen,
    onClose,
    onConfirm,
}: DeleteAccountModalProps) {
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (!confirmation) {
            setError('Please confirm you understand this action');
            return;
        }

        setError('');
        setLoading(true);

        const { error: deleteError } = await onConfirm(password);

        if (deleteError) {
            setError(deleteError.message);
            setLoading(false);
        }
        // Don't reset loading if successful - user will be redirected
    };

    const handleClose = () => {
        if (!loading) {
            setPassword('');
            setConfirmation(false);
            setError('');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={false}>
            <div className="p-6">
                {/* Warning Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Delete Account
                </h2>
                <p className="text-slate-400 text-center mb-6">
                    This action cannot be undone
                </p>

                {/* Warning Box */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                        Warning: This will permanently delete
                    </h3>
                    <ul className="text-sm text-red-300/80 space-y-1">
                        <li>• Your profile and account data</li>
                        <li>• All your projects and contributions</li>
                        <li>• Your messages and chat history</li>
                        <li>• Your connections and followers</li>
                    </ul>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Confirm your password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={confirmation}
                            onChange={(e) => setConfirmation(e.target.checked)}
                            disabled={loading}
                            className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
                        />
                        <span className="text-sm text-slate-300">
                            I understand this action cannot be undone and all my data will be permanently deleted
                        </span>
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading || !password || !confirmation}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Account'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
