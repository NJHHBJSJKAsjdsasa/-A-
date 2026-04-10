import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { getAvatarUrl } from '../utils/api';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('common.home') },
    { path: '/community', label: t('common.community') },
    { path: '/learning', label: t('common.learning') },
    { path: '/leaderboard', label: t('achievement.leaderboard') }
  ];

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-doraemon-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="font-bold text-xl text-gray-800 hidden sm:block">
                  {t('common.appName')}
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {['zh', 'en', 'ja', 'ko'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-2 py-1 text-sm rounded ${
                      i18n.language === lang
                        ? 'bg-doraemon-blue text-white'
                        : 'text-gray-600 hover:text-doraemon-blue'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/messages" className="relative">
                    <svg className="w-6 h-6 text-gray-600 hover:text-doraemon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <img
                      src={getAvatarUrl(user?.avatar)}
                      alt={user?.nickname}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700">{user?.nickname}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-secondary text-sm">
                    {t('common.login')}
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    {t('common.register')}
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 ${isActive(link.path) ? 'text-doraemon-blue font-semibold' : 'text-gray-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 py-2">
                {['zh', 'en', 'ja', 'ko'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-2 py-1 text-sm rounded ${
                      i18n.language === lang
                        ? 'bg-doraemon-blue text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {isAuthenticated ? (
                <div className="py-2">
                  <Link to="/profile" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>{t('common.profile')}</Link>
                  <button onClick={handleLogout} className="block py-2 text-gray-600">{t('common.logout')}</button>
                </div>
              ) : (
                <div className="py-2">
                  <Link to="/login" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>{t('common.login')}</Link>
                  <Link to="/register" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>{t('common.register')}</Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t('common.appName')}</h3>
              <p className="text-gray-400 text-sm">
                A multilingual platform for Doraemon fans worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('common.community')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/community">{t('community.posts')}</Link></li>
                <li><Link to="/circles">{t('community.circles')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('common.learning')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/learning">{t('learning.courses')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('achievement.achievements')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/leaderboard">{t('achievement.leaderboard')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Doraemon Multilingual Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
