export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Powered by JSB Media</span>
          <span>&copy; {new Date().getFullYear()} Datacolor</span>
        </div>
      </div>
    </footer>
  );
}
