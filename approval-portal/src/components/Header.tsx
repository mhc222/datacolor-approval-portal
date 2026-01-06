export default function Header() {
  return (
    <header className="bg-datacolor-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-datacolor-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <span className="font-semibold text-lg">Datacolor Spyder</span>
                <span className="text-datacolor-blue mx-2">|</span>
                <span className="text-gray-300">Content Approval</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Review & Approve Social Content
          </div>
        </div>
      </div>
    </header>
  );
}
