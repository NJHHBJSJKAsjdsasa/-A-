import { useTranslation } from 'react-i18next';

const CourseDetail = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t('course.courseDetail')}</h1>
      <p className="text-gray-600">{t('course.loadingCourse')}</p>
    </div>
  );
};

export default CourseDetail;
