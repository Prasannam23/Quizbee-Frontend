"use client"
import { useState } from 'react';
import { toastNotifications } from '@/lib/toastNotifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';

interface QuizCreatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    quizId: string;
    quizTitle: string;
}

export default function QuizCreatedModal({ isOpen, onClose, quizId, quizTitle }: QuizCreatedModalProps) {
    const [copied, setCopied] = useState(false);

    const shareLink = `${window.location.origin}/test/${quizId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toastNotifications.success.linkCopied();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            toastNotifications.error.copyFailed();
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Quiz: ${quizTitle}`,
                text: `Join my quiz: ${quizTitle}`,
                url: shareLink,
            });
        } else {
            handleCopyLink();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-green-600">
                        🎉 Quiz Created Successfully!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">{quizTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">Quiz ID: {quizId}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Share Link:</label>
                        <div className="flex gap-2">
                            <Input
                                value={shareLink}
                                readOnly
                                className="text-sm"
                            />
                            <Button
                                onClick={handleCopyLink}
                                variant="outline"
                                className="px-3"
                            >
                                {copied ? '✓' : '📋'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleShare}
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                            Share Quiz
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                        Students can join using the link above
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
