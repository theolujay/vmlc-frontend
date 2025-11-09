import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
export default function AppDialog({ open, onOpenChange,children }: { open?: boolean, onOpenChange?: (open: boolean) => void,children:React.ReactNode }) {
    return (
        <Dialog.Root open={open}
            onOpenChange={(open) => {
                onOpenChange?.(open)
            }}
        
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-20 backdrop-blur-sm  bg-black/60 data-[state=open]:animate-overlayShow"  />
                <Dialog.Content className="fixed z-50 left-1/2 top-1/2 max-h-[85vh] w-[100vw] md:w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                <VisuallyHidden.Root>

                    <Dialog.Title>Capture</Dialog.Title>
                </VisuallyHidden.Root>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
