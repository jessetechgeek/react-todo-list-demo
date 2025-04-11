const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {currentYear} Todo List App. All rights reserved.</p>
        <p className="mt-2">
          A simple todo list application built with React and TypeScript.
        </p>
      </div>
    </footer>
  );
};

export default Footer;