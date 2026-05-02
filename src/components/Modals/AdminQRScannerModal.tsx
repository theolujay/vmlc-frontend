import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketProvider';
import { toast } from 'react-toastify';

interface AdminQRScannerModalProps {
    open: boolean;
    onClose: () => void;
}

const AdminQRScannerModal: React.FC<AdminQRScannerModalProps> = ({ open, onClose }) => {
    const { sendAction } = useSocket();
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        if (!open) return;

        let html5QrCode: Html5Qrcode | null = null;
        let isRunning = false;
        let mounted = true;

        const stopScanner = async () => {
            if (html5QrCode && isRunning) {
                isRunning = false;
                try {
                    await html5QrCode.stop();
                } catch (err) {
                    if (!(err instanceof Error && err.message.includes('not running or paused'))) {
                        console.warn('Scanner stop warning:', err);
                    }
                }
            }
        };

        const startScanner = async () => {
            const element = document.getElementById('qr-reader');
            if (!element || !mounted) return;

            hasProcessedRef.current = false;
            html5QrCode = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = html5QrCode;

            try {
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        if (hasProcessedRef.current) return;
                        hasProcessedRef.current = true;

                        const [candidateId, examId, socketId] = decodedText.split(':');

                        if (candidateId && examId && socketId) {
                            sendAction('exam.unlock_request', {
                                candidate_id: candidateId,
                                exam_id: examId,
                                socket_id: socketId,
                            });

                            toast.success('Unlock signal sent to candidate dashboard!');
                            stopScanner().finally(() => onClose());
                        } else {
                            hasProcessedRef.current = false;
                            toast.error('Invalid QR code format detected.');
                        }
                    },
                    () => {}
                );
                isRunning = true;
            } catch (err) {
                console.error('Failed to start QR scanner:', err);
                toast.error('Unable to access camera. Please check permissions and try again.');
            }
        };

        const timer = setTimeout(startScanner, 200);

        return () => {
            mounted = false;
            clearTimeout(timer);
            stopScanner().then(() => {
                html5QrCodeRef.current = null;
            });
        };
    }, [open, sendAction, onClose]);

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-white rounded-4xl p-8 shadow-2xl z-101 focus:outline-none"
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#3E4095]/10 rounded-xl flex items-center justify-center">
                                                <i className="fas fa-camera text-[#3E4095]"></i>
                                            </div>
                                        <div>
                                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                                Scan Candidate QR
                                            </Dialog.Title>
                                            <Dialog.Description className="text-xs text-grey-500 font-medium">Position the QR code within the frame</Dialog.Description>
                                        </div>
                                        </div>
                                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <div className="relative overflow-hidden rounded-3xl bg-gray-900 aspect-square border-4 border-gray-50 shadow-inner">
                                        <div id="qr-reader" className="w-full h-full"></div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <i className="fas fa-shield-alt text-amber-600"></i>
                                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                            Scanning to unlock final for candidate.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default AdminQRScannerModal;
