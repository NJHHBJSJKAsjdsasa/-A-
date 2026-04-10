import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchCourses } from '../store/slices/learningSlice';
import { RootState } from '../store';

const Learning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state: RootState) => state.learning);

  useEffect(() => {
    dispatch(fetchCourses({}) as any);
  }, [dispatch]);

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('learning.courses')}</h1>

      <div className="flex space-x-4 mb-8">
        <select className="input-field w-48">
          <option value="">{t('learning.courses')}</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
        <select className="input-field w-48">
          <option value="">{t('achievement.level')}</option>
          <option value="beginner">{t('learning.beginner')}</option>
          <option value="intermediate">{t('learning.intermediate')}</option>
          <option value="advanced">{t('learning.advanced')}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="card hover:shadow-xl transition-shadow">
              <div className="h-40 bg-gradient-to-r from-doraemon-blue to-blue-600 rounded-xl mb-4"></div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${levelColors[course.level]}`}>
                  {t(`learning.${course.level}`)}
                </span>
                <span className="text-sm text-gray-500">{course.language.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{course.enrolled} 人已报名</span>
              </div>
              <Link to={`/courses/${course._id}`} className="btn-primary w-full block text-center">
                {t('learning.enroll')}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learning;
