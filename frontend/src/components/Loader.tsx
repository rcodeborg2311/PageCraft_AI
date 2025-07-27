
export function Loader() {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
                <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-zinc-500 text-sm mt-3 font-medium">Processing...</p>
        </div>
    );
}