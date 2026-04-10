import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home = () => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const features = [
    { icon: '🌐', title: '多语言支持', description: '支持中文、英语、日语、韩语四种语言' },
    { icon: '💬', title: '社区交流', description: '发布帖子、评论互动、加入兴趣圈子' },
    { icon: '📚', title: '语言学习', description: '丰富的语言课程，轻松学习新语言' },
    { icon: '🏆', title: '成就系统', description: '等级徽章、积分奖励、排行榜竞争' }
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
            <p className="text-xl md:text-2xl mb-8 text-blue-100">连接全球哆啦A梦粉丝，一起学习、交流、成长</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-doraemon-blue px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">立即加入</Link>
              <Link to="/community" className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-doraemon-blue transition-colors">浏览社区</Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">平台特色</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">热门圈子</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: '日语学习小组', members: 1234, posts: 567 },
            { name: '英语角', members: 2345, posts: 890 },
            { name: '韩语爱好者', members: 987, posts: 345 }
          ].map((circle, index) => (
            <div key={index} className={`border-2 border-gray-100 rounded-2xl p-6 hover-lift hover:border-doraemon-blue transition-colors animate-bounce-in stagger-${index + 1}`}>
              <h3 className="font-semibold text-lg mb-2">{circle.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{circle.members} 成员 · {circle.posts} 帖子</p>
              <button className="btn-secondary text-sm w-full hover-glow">{t('community.joinCircle')}</button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 animate-fade-in stagger-4">
          <Link to="/circles" className="text-doraemon-blue font-semibold hover:underline hover-scale">查看更多圈子 →</Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">推荐课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '日语入门', language: '日语', level: '初级', enrolled: 3456 },
            { title: '英语口语进阶', language: '英语', level: '中级', enrolled: 4567 },
            { title: '韩语基础', language: '韩语', level: '初级', enrolled: 2345 }
          ].map((course, index) => (
            <div key={index} className={`card hover-lift animate-slide-in stagger-${index + 1}`}>
              <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl mb-4 hover-scale"></div>
              <span className="text-sm text-doraemon-blue font-medium">{course.language} · {course.level}</span>
              <h3 className="font-semibold text-lg mt-2 mb-2">{course.title}</h3>
              <p className="text-gray-500 text-sm">{course.enrolled} 人已报名</p>
              <button className="btn-primary w-full mt-4 hover-glow">{t('learning.enroll')}</button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 animate-fade-in stagger-4">
          <Link to="/learning" className="text-doraemon-blue font-semibold hover:underline hover-scale">查看更多课程 →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
