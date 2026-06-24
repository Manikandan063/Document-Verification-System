import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-gray-200 bg-white/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search documents, AI analyses..." 
          className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 transition-shadow shadow-sm"
        />
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:text-brand-purple transition-colors shadow-sm relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-green rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
