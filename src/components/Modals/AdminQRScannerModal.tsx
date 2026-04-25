import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketProvider';
import { toast } from 'react-toastify';

interface AdminQRScannerModalProps {
    open: boolean;
    onClose: () => void;
}

const AdminQRScannerModal: React.FC<AdminQRScannerModalProps> = ({ open, onClose }) => {
    const { sendAction } = useSocket();
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        if (open && isScanning) {
            // Delay initialization to ensure the DOM node is rendered within the Radix Portal
            const timer = setTimeout(() => {
                scanner = new Html5QrcodeScanner(
                    'qr-reader',
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    false
                );

                scanner.render(
                    (decodedText) => {
                        // Expected format: candidateId:examId:socketId:timestamp
                        const [candidateId, examId, socketId] = decodedText.split(':');

                        if (candidateId && examId && socketId) {
                            scanner?.clear().catch(console.error);
                            setIsScanning(false);

                            sendAction('exam.unlock_request', {
                                candidate_id: candidateId,
                                exam_id: examId,
                                socket_id: socketId
                            });

                            toast.success('Unlock signal sent to candidate dashboard!');
                            onClose();
                        } else {
                            toast.error('Invalid QR code format detected.');
                        }
                    },
                    (error) => {
                        // Only log high-priority errors if needed
                    }
                );
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scanner) {
                    scanner.clear().catch(console.error);
                }
            };
        }
    }, [open, isScanning, sendAction, onClose]);

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
                                                <p className="text-xs text-grey-500 font-medium">Position the QR code within the frame</p>
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
                                            Scanning will automatically verify the candidate and unlock their final exam session in real-time.
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
