import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    nickname: string;
    avatar: string;
  };
  circleId: string;
  likes: number;
  comments: number;
  images: string[];
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    nickname: string;
    avatar: string;
  };
  createdAt: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      if (data.success) {
        setPost(data.data);
      } else {
        setError(data.error?.message || t('common.loading'));
      }
    } catch (err) {
      setError(t('common.loading'));
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('community.pleaseLogin'));
      return;
    }
    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchPost();
      }
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('community.pleaseLogin'));
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
        fetchPost();
      }
    } catch (err) {
      alert(t('community.postComment'));
    }
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'zh' ? 'zh-CN' : 
                   i18n.language === 'ja' ? 'ja-JP' :
                   i18n.language === 'ko' ? 'ko-KR' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 mb-4">{error || t('common.noData')}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-doraemon-blue transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        {t('common.back')}
      </button>

      {/* Post Content */}
      <article className="card">
        {/* Author Info */}
        <div className="flex items-center mb-6">
          <img
            src={post.authorId?.avatar || '/avatars/1.png'}
            alt={post.authorId?.nickname}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.authorId?.nickname || 'Anonymous'}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Content */}
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="rounded-lg w-full h-64 object-cover"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{post.likes || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-doraemon-blue transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-doraemon-blue transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{t('community.share')}</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">{t('community.comment')} ({comments.length})</h2>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('community.writeComment')}
            className="input-field w-full h-24 resize-none mb-3"
          />
          <button type="submit" className="btn-primary">
            {t('community.postComment')}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('community.noComments')}</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex space-x-4">
                <img
                  src={comment.authorId?.avatar || '/avatars/1.png'}
                  alt={comment.authorId?.nickname}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{comment.authorId?.nickname || 'Anonymous'}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
