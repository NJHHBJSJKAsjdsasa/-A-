import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../store/slices/authSlice';
import { RootState } from '../store';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }) as never);
    if ((result as { meta: { requestStatus: string } }).meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-doraemon-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('common.login')}</h1>
          <p className="text-gray-500 mt-2">{t('common.appName')}</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">记住我</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-doraemon-blue hover:underline">{t('auth.forgotPassword')}</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">或使用第三方登录</span></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button className="border-2 border-gray-200 rounded-xl py-2 hover:border-doraemon-blue transition-colors">微信</button>
            <button className="border-2 border-gray-200 rounded-xl py-2 hover:border-doraemon-blue transition-colors">QQ</button>
            <button className="border-2 border-gray-200 rounded-xl py-2 hover:border-doraemon-blue transition-colors">微博</button>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-doraemon-blue font-semibold hover:underline">{t('common.register')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
