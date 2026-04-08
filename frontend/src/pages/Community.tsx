import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPosts } from '../store/slices/communitySlice';
import { RootState } from '../store';

const Community = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.community);

  useEffect(() => {
    dispatch(fetchPosts() as never);
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('community.posts')}</h1>
        <Link to="/posts/create" className="btn-primary">{t('community.createPost')}</Link>
      </div>

      {loading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post._id} to={`/posts/${post._id}`} className="card block hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <img src={post.authorId?.avatar || '/avatars/default.png'} alt="" className="w-6 h-6 rounded-full" />
                  <span>{post.authorId?.nickname}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
