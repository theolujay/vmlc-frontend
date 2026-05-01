import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketProvider';

interface QRVerificationModalProps {
    open: boolean;
    onClose: () => void;
    candidateId: string;
    examId: string;
}

const QRVerificationModal: React.FC<QRVerificationModalProps> = ({ open, onClose, candidateId, examId }) => {
    const { socketId } = useSocket();
    const qrValue = `${candidateId}:${examId}:${socketId}`;

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
                                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-4xl p-8 shadow-2xl z-101 focus:outline-none"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                        <i className="fas fa-qrcode text-[#3E4095] text-2xl"></i>
                                    </div>

                                    <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
                                        Final Exam Verification
                                    </Dialog.Title>

                                    <Dialog.Description className="text-grey-500 text-sm mb-8 leading-relaxed">
                                        Please show this QR code to the invigilator at your exam center to unlock your session.
                                    </Dialog.Description>

                                    <div className="p-6 bg-white border-2 border-dashed border-[#E4E7EC] rounded-3xl mb-8 shadow-sm">
                                        <QRCodeSVG
                                            value={qrValue}
                                            size={200}
                                            level="H"
                                            marginSize={0}
                                            fgColor="#3E4095"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 text-[#3E4095] font-bold text-sm bg-blue-50/50 px-6 py-3 rounded-full animate-pulse">
                                        <div className="w-2 h-2 bg-[#3E4095] rounded-full"></div>
                                        WAITING FOR ADMIN VERIFICATION
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="mt-8 text-[#98A2B3] text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                                    >
                                        Cancel & Go Back
                                    </button>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default QRVerificationModal;
