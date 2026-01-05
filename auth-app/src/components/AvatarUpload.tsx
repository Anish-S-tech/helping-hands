'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, User } from 'lucide-react';
import Image from 'next/image';

interface AvatarUploadProps {
    currentAvatar?: string | null;
    onUpload: (file: File) => void;
    onRemove?: () => void;
}

export function AvatarUpload({ currentAvatar, onUpload, onRemove }: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentAvatar || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Call parent callback
        onUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onRemove?.();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-slate-700">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Avatar preview"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <User className="w-16 h-16 text-white" />
                    )}
                </div>

                {preview && (
                    <button
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Remove avatar"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-xs p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                    }`}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-400' : 'text-slate-400'}`} />
                    <p className="text-sm text-slate-300 font-medium">
                        {isDragging ? 'Drop your photo here' : 'Click or drag to upload'}
                    </p>
                    <p className="text-xs text-slate-500">
                        PNG, JPG up to 2MB
                    </p>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
