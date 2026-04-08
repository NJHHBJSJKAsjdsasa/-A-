import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCircles } from '../store/slices/communitySlice';
import { RootState } from '../store';

const Circles = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { circles, loading } = useSelector((state: RootState) => state.community);

  useEffect(() => {
    dispatch(fetchCircles() as never);
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('community.circles')}</h1>

      {loading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : circles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => (
            <div key={circle._id} className="card hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-r from-doraemon-blue to-blue-600 rounded-xl mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">{circle.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{circle.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{circle.members.length} {t('community.members')}</span>
                <span>{circle.posts} {t('community.postsCount')}</span>
              </div>
              <button className="btn-primary w-full">{t('community.joinCircle')}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Circles;
