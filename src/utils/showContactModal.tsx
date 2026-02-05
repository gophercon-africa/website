import { toast } from 'sonner';
import { X } from 'lucide-react';

export function showContactModal() {
    const id = toast(
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full relative">
            <button
                onClick={() => toast.dismiss(id)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[#006B3F] flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">hello@gophers.africa</div>
                    </div>
                </div>
            </div>
        </div>,
        {
            duration: Infinity,
            position: 'top-center',
            className: 'bg-transparent! p-0! shadow-none!',
        }
    );
}
