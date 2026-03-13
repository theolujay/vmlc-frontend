import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import clsx from 'clsx';

export default function AppDialog({ open, onOpenChange, children, className }: { open?: boolean, onOpenChange?: (open: boolean) => void, children: React.ReactNode, className?: string }) {
    return (
        <Dialog.Root open={open}
            onOpenChange={(open) => {
                onOpenChange?.(open)
            }}
        
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-20 backdrop-blur-sm  bg-black/60 data-[state=open]:animate-overlayShow"  />
                <Dialog.Content className={clsx("fixed z-50 left-1/2 top-1/2 max-h-[85vh] w-[100vw] md:w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow", className)}>
                <VisuallyHidden.Root>
                    <Dialog.Title>Capture</Dialog.Title>
                    <Dialog.Description>
                        This is a dialog for capturing user input.
                    </Dialog.Description>
                </VisuallyHidden.Root>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
