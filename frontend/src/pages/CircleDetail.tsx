import { useTranslation } from 'react-i18next';

const CircleDetail = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{t('circle.circleDetail')}</h1>
      <p className="text-gray-600">{t('circle.loadingCircle')}</p>
    </div>
  );
};

export default CircleDetail;
