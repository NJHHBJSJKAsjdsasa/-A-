db = db.getSiblingDB('doraemon');

db.createCollection('users');
db.createCollection('posts');
db.createCollection('comments');
db.createCollection('circles');
db.createCollection('conversations');
db.createCollection('messages');
db.createCollection('badges');
db.createCollection('user_achievements');
db.createCollection('leaderboards');
db.createCollection('courses');
db.createCollection('lessons');
db.createCollection('user_progress');
db.createCollection('files');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { sparse: true, unique: true });
db.users.createIndex({ 'oauthProviders.providerId': 1 }, { sparse: true });

db.posts.createIndex({ authorId: 1 });
db.posts.createIndex({ circleId: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ tags: 1 });

db.comments.createIndex({ postId: 1 });
db.comments.createIndex({ authorId: 1 });

db.circles.createIndex({ ownerId: 1 });
db.circles.createIndex({ members: 1 });

db.conversations.createIndex({ participants: 1 });
db.messages.createIndex({ conversationId: 1, createdAt: -1 });

db.user_achievements.createIndex({ userId: 1, badgeId: 1 }, { unique: true });

db.courses.createIndex({ language: 1, level: 1 });
db.lessons.createIndex({ courseId: 1, order: 1 });
db.user_progress.createIndex({ userId: 1, courseId: 1 });

db.files.createIndex({ uploaderId: 1 });

const badges = [
  {
    name: 'first_post',
    nameZh: '初次发帖',
    nameEn: 'First Post',
    nameJa: '初めての投稿',
    nameKo: '첫 게시물',
    description: '发布你的第一篇帖子',
    descriptionEn: 'Publish your first post',
    icon: '/badges/first_post.png',
    category: 'social',
    condition: { type: 'posts_count', value: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    name: 'popular_post',
    nameZh: '人气帖子',
    nameEn: 'Popular Post',
    nameJa: '人気の投稿',
    nameKo: '인기 게시물',
    description: '帖子获得100个赞',
    descriptionEn: 'Get 100 likes on a post',
    icon: '/badges/popular_post.png',
    category: 'social',
    condition: { type: 'post_likes', value: 100 },
    points: 50,
    rarity: 'rare'
  },
  {
    name: 'first_course',
    nameZh: '学习启航',
    nameEn: 'Learning Journey',
    nameJa: '学習の旅',
    nameKo: '학습 여행',
    description: '完成第一个课程',
    descriptionEn: 'Complete your first course',
    icon: '/badges/first_course.png',
    category: 'learning',
    condition: { type: 'courses_completed', value: 1 },
    points: 30,
    rarity: 'common'
  },
  {
    name: 'language_master',
    nameZh: '语言大师',
    nameEn: 'Language Master',
    nameJa: '言語マスター',
    nameKo: '언어 마스터',
    description: '完成所有语言课程',
    descriptionEn: 'Complete all language courses',
    icon: '/badges/language_master.png',
    category: 'learning',
    condition: { type: 'all_courses_completed', value: 1 },
    points: 200,
    rarity: 'legendary'
  },
  {
    name: 'community_builder',
    nameZh: '社区建设者',
    nameEn: 'Community Builder',
    nameJa: 'コミュニティビルダー',
    nameKo: '커뮤니티 빌더',
    description: '创建一个拥有100名成员的圈子',
    descriptionEn: 'Create a circle with 100 members',
    icon: '/badges/community_builder.png',
    category: 'contribution',
    condition: { type: 'circle_members', value: 100 },
    points: 100,
    rarity: 'epic'
  }
];

db.badges.insertMany(badges);

print('MongoDB initialization completed!');
