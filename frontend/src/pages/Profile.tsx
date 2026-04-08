import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar || '/avatars/default.png'}
            alt={user?.nickname}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.nickname}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-600">{t('achievement.level')}: {user?.level || 1}</span>
              <span className="text-sm text-gray-600">{t('achievement.exp')}: {user?.exp || 0}</span>
              <span className="text-sm text-gray-600">{t('achievement.points')}: {user?.points || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('achievement.badges')}</h2>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('learning.myCourses')}</h2>
          <p className="text-gray-500">暂无报名课程</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('community.posts')}</h2>
          <p className="text-gray-500">暂无发布的帖子</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('community.circles')}</h2>
          <p className="text-gray-500">暂无加入的圈子</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
