import { X } from "lucide-react";

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-lg rounded-xl border border-[#D8DEE5] bg-white p-6 shadow-xl dark:border-[#254757] dark:bg-[#1B3138]"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#203A43] dark:text-[#F5F7FA]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-[#5B6770] hover:bg-[#E9EEF2] hover:text-[#203A43] dark:text-[#D8DEE5] dark:hover:bg-[#203A43] dark:hover:text-[#F5F7FA]"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 space-y-4">{children}</div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    {footer ?? (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm text-[#203A43] bg-[#E9EEF2] hover:bg-[#D8DEE5] dark:text-[#F5F7FA] dark:bg-[#203A43] dark:hover:bg-[#1B3138]"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;
