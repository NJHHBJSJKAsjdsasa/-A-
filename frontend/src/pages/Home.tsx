import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home = () => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const features = [
    { icon: '🌐', title: t('home.multilingualSupport'), description: t('home.multilingualDescription') },
    { icon: '💬', title: t('home.communityExchange'), description: t('home.communityDescription') },
    { icon: '📚', title: t('home.languageLearning'), description: t('home.learningDescription') },
    { icon: '🏆', title: t('home.achievementSystem'), description: t('home.achievementDescription') }
  ];

  return (
    <div className="space-y-16">
      {!isAuthenticated && (
        <section className="relative bg-gradient-to-r from-doraemon-blue to-blue-600 text-white py-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('common.appName')}</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">{t('home.heroTitle')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-doraemon-blue px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">{t('home.joinNow')}</Link>
              <Link to="/community" className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-doraemon-blue transition-colors">{t('home.browseCommunity')}</Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">{t('home.platformFeatures')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`card text-center hover-lift animate-slide-in stagger-${index + 1}`}>
              <div className="text-5xl mb-4 hover-scale">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">{t('home.hotCircles')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Japanese Learning Group', members: 1234, posts: 567 },
            { name: 'English Corner', members: 2345, posts: 890 },
            { name: 'Korean Lovers', members: 987, posts: 345 }
          ].map((circle, index) => (
            <div key={index} className={`border-2 border-gray-100 rounded-2xl p-6 hover-lift hover:border-doraemon-blue transition-colors animate-bounce-in stagger-${index + 1}`}>
              <h3 className="font-semibold text-lg mb-2">{circle.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{circle.members} {t('home.members')} · {circle.posts} {t('home.posts')}</p>
              <button className="btn-secondary text-sm w-full hover-glow">{t('community.joinCircle')}</button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 animate-fade-in stagger-4">
          <Link to="/circles" className="text-doraemon-blue font-semibold hover:underline hover-scale">{t('home.viewMoreCircles')}</Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">{t('home.recommendedCourses')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Japanese for Beginners', language: 'Japanese', level: 'Beginner', enrolled: 3456 },
            { title: 'English Speaking Advanced', language: 'English', level: 'Intermediate', enrolled: 4567 },
            { title: 'Korean Basics', language: 'Korean', level: 'Beginner', enrolled: 2345 }
          ].map((course, index) => (
            <div key={index} className={`card hover-lift animate-slide-in stagger-${index + 1}`}>
              <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl mb-4 hover-scale"></div>
              <span className="text-sm text-doraemon-blue font-medium">{course.language} · {course.level}</span>
              <h3 className="font-semibold text-lg mt-2 mb-2">{course.title}</h3>
              <p className="text-gray-500 text-sm">{course.enrolled} {t('home.enrolled')}</p>
              <button className="btn-primary w-full mt-4 hover-glow">{t('learning.enroll')}</button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 animate-fade-in stagger-4">
          <Link to="/learning" className="text-doraemon-blue font-semibold hover:underline hover-scale">{t('home.viewMoreCourses')}</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
