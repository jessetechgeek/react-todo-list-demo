import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              TodoMaster
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Beta</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              A modern task management application
            </p>
          </div>
          
          <div className="flex gap-6 my-4 md:my-0">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition">
              <Mail size={20} />
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            <p className="flex items-center justify-center md:justify-end">
              Made with <Heart size={14} className="text-red-500 mx-1" /> for better productivity
            </p>
            <p>© {currentYear} TodoMaster. All rights reserved.</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition">Help Center</a>
            <a href="#" className="hover:text-blue-600 transition">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;