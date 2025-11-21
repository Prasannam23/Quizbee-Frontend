export default function Footer() {
    return (
      <footer className="w-full px-6 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-black dark:text-white">ScoreBee</span>. All rights reserved.
          </p>
          <p className="mt-1">
            Designed for seamless quiz creation and performance tracking 🐝
          </p>
        </div>
      </footer>
    );
  }
  