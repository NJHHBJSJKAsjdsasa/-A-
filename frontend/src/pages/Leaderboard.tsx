import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();

  const mockLeaderboard = [
    { rank: 1, nickname: '哆啦A梦粉丝', level: 50, exp: 12500 },
    { rank: 2, nickname: '语言学习达人', level: 45, exp: 10200 },
    { rank: 3, nickname: '社区活跃者', level: 40, exp: 8900 },
    { rank: 4, nickname: '日语爱好者', level: 38, exp: 7500 },
    { rank: 5, nickname: '英语学习者', level: 35, exp: 6200 }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('achievement.leaderboard')}</h1>

      <div className="flex space-x-4 mb-8">
        <button className="btn-primary">{t('leaderboard.experience')}</button>
        <button className="btn-secondary">{t('leaderboard.points')}</button>
        <button className="btn-secondary">{t('leaderboard.learning')}</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4">{t('leaderboard.rank')}</th>
                <th className="text-left py-4 px-4">{t('leaderboard.user')}</th>
                <th className="text-left py-4 px-4">{t('achievement.level')}</th>
                <th className="text-left py-4 px-4">{t('achievement.exp')}</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((user) => (
                <tr key={user.rank} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.rank === 1 ? 'bg-yellow-400 text-white' :
                      user.rank === 2 ? 'bg-gray-300 text-white' :
                      user.rank === 3 ? 'bg-orange-400 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-doraemon-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{user.nickname[0]}</span>
                      </div>
                      <span className="font-medium">{user.nickname}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{user.level}</td>
                  <td className="py-4 px-4">{user.exp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
