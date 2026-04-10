import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    resources: {
      zh: {
        translation: {
          common: {
            appName: '哆啦A梦多语言平台',
            home: '首页',
            community: '社区',
            learning: '学习',
            messages: '消息',
            profile: '个人中心',
            login: '登录',
            register: '注册',
            logout: '退出登录',
            search: '搜索',
            submit: '提交',
            cancel: '取消',
            save: '保存',
            edit: '编辑',
            delete: '删除',
            loading: '加载中...',
            noData: '暂无数据',
            loadMore: '加载更多',
            back: '返回',
            publish: '发布'
          },
          auth: {
            email: '邮箱',
            password: '密码',
            confirmPassword: '确认密码',
            nickname: '昵称',
            forgotPassword: '忘记密码？',
            noAccount: '还没有账号？',
            hasAccount: '已有账号？',
            loginSuccess: '登录成功',
            registerSuccess: '注册成功',
            loginFailed: '登录失败',
            registerFailed: '注册失败'
          },
          community: {
            posts: '帖子',
            circles: '圈子',
            createPost: '发布帖子',
            postTitle: '标题',
            postContent: '内容',
            like: '点赞',
            comment: '评论',
            share: '分享',
            joinCircle: '加入圈子',
            leaveCircle: '退出圈子',
            members: '成员',
            postsCount: '帖子数',
            tags: '标签（逗号分隔）',
            tagsPlaceholder: '例如：欢迎, 介绍, 帮助',
            writeComment: '写评论...',
            postComment: '发表评论',
            noComments: '暂无评论，来抢沙发吧！',
            pleaseLogin: '请先登录'
          },
          learning: {
            courses: '课程',
            myCourses: '我的课程',
            progress: '学习进度',
            beginner: '初级',
            intermediate: '中级',
            advanced: '高级',
            enroll: '报名学习',
            continue: '继续学习',
            completed: '已完成',
            lesson: '课时',
            exercise: '练习'
          },
          achievement: {
            level: '等级',
            exp: '经验值',
            points: '积分',
            badges: '徽章',
            leaderboard: '排行榜',
            achievements: '成就'
          },
          profile: {
            uploadAvatar: '上传头像',
            changeAvatar: '更换头像',
            invalidAvatarType: '只支持图片文件（JPEG、PNG、GIF、WebP、SVG）',
            avatarTooLarge: '头像文件大小不能超过5MB',
            uploadFailed: '上传失败，请重试',
            avatarHint: '支持 JPG、PNG、GIF、WebP、SVG 格式，最大 5MB',
            noCourses: '暂无报名课程',
            noPosts: '暂无发布的帖子',
            noCircles: '暂无加入的圈子'
          },
          messages: {
            messageList: '消息列表',
            officialAccount: '哆啦A梦官方',
            welcomeMessage: '欢迎来到哆啦A梦平台！',
            chatWindow: '聊天窗口',
            selectConversation: '选择一个对话开始聊天',
            inputMessage: '输入消息...',
            send: '发送'
          },
          home: {
            platformFeatures: '平台特色',
            hotCircles: '热门圈子',
            recommendedCourses: '推荐课程',
            joinNow: '立即加入',
            browseCommunity: '浏览社区',
            multilingualSupport: '多语言支持',
            communityExchange: '社区交流',
            languageLearning: '语言学习',
            achievementSystem: '成就系统',
            multilingualDescription: '支持中文、英语、日语、韩语四种语言',
            communityDescription: '发布帖子、评论互动、加入兴趣圈子',
            learningDescription: '丰富的语言课程，轻松学习新语言',
            achievementDescription: '等级徽章、积分奖励、排行榜竞争',
            heroTitle: '连接全球哆啦A梦粉丝，一起学习、交流、成长',
            members: '成员',
            posts: '帖子',
            viewMoreCircles: '查看更多圈子 →',
            viewMoreCourses: '查看更多课程 →',
            enrolled: '人已报名'
          },
          leaderboard: {
            experience: '经验值',
            points: '积分',
            learning: '学习',
            rank: '排名',
            user: '用户'
          },
          login: {
            rememberMe: '记住我',
            orLoginWith: '或使用第三方登录',
            wechat: '微信',
            weibo: '微博'
          },
          course: {
            courseDetail: '课程详情',
            loadingCourse: '课程内容加载中...'
          },
          circle: {
            circleDetail: '圈子详情',
            loadingCircle: '圈子内容加载中...'
          }
        }
      },
      en: {
        translation: {
          common: {
            appName: 'Doraemon Multilingual Platform',
            home: 'Home',
            community: 'Community',
            learning: 'Learning',
            messages: 'Messages',
            profile: 'Profile',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            search: 'Search',
            submit: 'Submit',
            cancel: 'Cancel',
            save: 'Save',
            edit: 'Edit',
            delete: 'Delete',
            loading: 'Loading...',
            noData: 'No data',
            loadMore: 'Load More',
            back: 'Back',
            publish: 'Publish'
          },
          auth: {
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            nickname: 'Nickname',
            forgotPassword: 'Forgot Password?',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            loginSuccess: 'Login successful',
            registerSuccess: 'Registration successful',
            loginFailed: 'Login failed',
            registerFailed: 'Registration failed'
          },
          community: {
            posts: 'Posts',
            circles: 'Circles',
            createPost: 'Create Post',
            postTitle: 'Title',
            postContent: 'Content',
            like: 'Like',
            comment: 'Comment',
            share: 'Share',
            joinCircle: 'Join Circle',
            leaveCircle: 'Leave Circle',
            members: 'Members',
            postsCount: 'Posts',
            tags: 'Tags (comma separated)',
            tagsPlaceholder: 'e.g. welcome, intro, help',
            writeComment: 'Write a comment...',
            postComment: 'Post Comment',
            noComments: 'No comments yet. Be the first to comment!',
            pleaseLogin: 'Please login first'
          },
          learning: {
            courses: 'Courses',
            myCourses: 'My Courses',
            progress: 'Progress',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            enroll: 'Enroll',
            continue: 'Continue',
            completed: 'Completed',
            lesson: 'Lesson',
            exercise: 'Exercise'
          },
          achievement: {
            level: 'Level',
            exp: 'Experience',
            points: 'Points',
            badges: 'Badges',
            leaderboard: 'Leaderboard',
            achievements: 'Achievements'
          },
          profile: {
            uploadAvatar: 'Upload Avatar',
            changeAvatar: 'Change Avatar',
            invalidAvatarType: 'Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed',
            avatarTooLarge: 'Avatar file size must be less than 5MB',
            uploadFailed: 'Upload failed, please try again',
            avatarHint: 'Supports JPG, PNG, GIF, WebP, SVG formats, max 5MB',
            noCourses: 'No enrolled courses',
            noPosts: 'No posts published',
            noCircles: 'No circles joined'
          },
          messages: {
            messageList: 'Message List',
            officialAccount: 'Doraemon Official',
            welcomeMessage: 'Welcome to Doraemon Platform!',
            chatWindow: 'Chat Window',
            selectConversation: 'Select a conversation to start chatting',
            inputMessage: 'Type a message...',
            send: 'Send'
          },
          home: {
            platformFeatures: 'Platform Features',
            hotCircles: 'Hot Circles',
            recommendedCourses: 'Recommended Courses',
            joinNow: 'Join Now',
            browseCommunity: 'Browse Community',
            multilingualSupport: 'Multilingual Support',
            communityExchange: 'Community Exchange',
            languageLearning: 'Language Learning',
            achievementSystem: 'Achievement System',
            multilingualDescription: 'Supports Chinese, English, Japanese, and Korean',
            communityDescription: 'Post, comment, and join interest circles',
            learningDescription: 'Rich language courses for easy learning',
            achievementDescription: 'Level badges, points rewards, leaderboard competition',
            heroTitle: 'Connect Doraemon fans worldwide to learn, exchange, and grow together',
            members: 'Members',
            posts: 'Posts',
            viewMoreCircles: 'View more circles →',
            viewMoreCourses: 'View more courses →',
            enrolled: 'people enrolled'
          },
          leaderboard: {
            experience: 'Experience',
            points: 'Points',
            learning: 'Learning',
            rank: 'Rank',
            user: 'User'
          },
          login: {
            rememberMe: 'Remember me',
            orLoginWith: 'Or login with',
            wechat: 'WeChat',
            weibo: 'Weibo'
          },
          course: {
            courseDetail: 'Course Detail',
            loadingCourse: 'Loading course content...'
          },
          circle: {
            circleDetail: 'Circle Detail',
            loadingCircle: 'Loading circle content...'
          }
        }
      },
      ja: {
        translation: {
          common: {
            appName: 'ドラえもん多言語プラットフォーム',
            home: 'ホーム',
            community: 'コミュニティ',
            learning: '学習',
            messages: 'メッセージ',
            profile: 'プロフィール',
            login: 'ログイン',
            register: '登録',
            logout: 'ログアウト',
            search: '検索',
            submit: '送信',
            cancel: 'キャンセル',
            save: '保存',
            edit: '編集',
            delete: '削除',
            loading: '読み込み中...',
            noData: 'データがありません',
            loadMore: 'もっと読む',
            back: '戻る',
            publish: '投稿'
          },
          auth: {
            email: 'メール',
            password: 'パスワード',
            confirmPassword: 'パスワード確認',
            nickname: 'ニックネーム',
            forgotPassword: 'パスワードを忘れた？',
            noAccount: 'アカウントをお持ちでないですか？',
            hasAccount: 'すでにアカウントをお持ちですか？',
            loginSuccess: 'ログイン成功',
            registerSuccess: '登録成功',
            loginFailed: 'ログイン失敗',
            registerFailed: '登録失敗'
          },
          community: {
            posts: '投稿',
            circles: 'サークル',
            createPost: '投稿を作成',
            postTitle: 'タイトル',
            postContent: '内容',
            like: 'いいね',
            comment: 'コメント',
            share: 'シェア',
            joinCircle: 'サークルに参加',
            leaveCircle: 'サークルを退会',
            members: 'メンバー',
            postsCount: '投稿数',
            tags: 'タグ（カンマ区切り）',
            tagsPlaceholder: '例：ようこそ, 紹介, ヘルプ',
            writeComment: 'コメントを書く...',
            postComment: 'コメント投稿',
            noComments: 'まだコメントがありません。最初のコメントを投稿しましょう！',
            pleaseLogin: 'ログインしてください'
          },
          learning: {
            courses: 'コース',
            myCourses: 'マイコース',
            progress: '進捗',
            beginner: '初級',
            intermediate: '中級',
            advanced: '上級',
            enroll: '登録',
            continue: '続ける',
            completed: '完了',
            lesson: 'レッスン',
            exercise: '練習'
          },
          achievement: {
            level: 'レベル',
            exp: '経験値',
            points: 'ポイント',
            badges: 'バッジ',
            leaderboard: 'ランキング',
            achievements: '実績'
          },
          profile: {
            uploadAvatar: 'アバターをアップロード',
            changeAvatar: 'アバターを変更',
            invalidAvatarType: '画像ファイル（JPEG、PNG、GIF、WebP、SVG）のみ対応',
            avatarTooLarge: 'アバターのファイルサイズは5MB以下にしてください',
            uploadFailed: 'アップロードに失敗しました。もう一度お試しください',
            avatarHint: 'JPG、PNG、GIF、WebP、SVG形式対応、最大5MB',
            noCourses: '登録コースがありません',
            noPosts: '投稿がありません',
            noCircles: 'サークルに参加していません'
          },
          messages: {
            messageList: 'メッセージリスト',
            officialAccount: 'ドラえもん公式',
            welcomeMessage: 'ドラえもんプラットフォームへようこそ！',
            chatWindow: 'チャットウィンドウ',
            selectConversation: '会話を選択してチャットを開始',
            inputMessage: 'メッセージを入力...',
            send: '送信'
          },
          home: {
            platformFeatures: 'プラットフォームの特徴',
            hotCircles: '人気サークル',
            recommendedCourses: 'おすすめコース',
            joinNow: '今すぐ参加',
            browseCommunity: 'コミュニティを探索',
            multilingualSupport: '多言語サポート',
            communityExchange: 'コミュニティ交流',
            languageLearning: '言語学習',
            achievementSystem: 'アチーブメントシステム',
            multilingualDescription: '中国語、英語、日本語、韓国語に対応',
            communityDescription: '投稿、コメント、興味のサークルに参加',
            learningDescription: '豊富な言語コースで簡単学習',
            achievementDescription: 'レベルバッジ、ポイント報酬、ランキング競争',
            heroTitle: '世界中のドラえもんファンをつなぎ、一緒に学び、交流し、成長',
            members: 'メンバー',
            posts: '投稿',
            viewMoreCircles: 'もっとサークルを見る →',
            viewMoreCourses: 'もっとコースを見る →',
            enrolled: '人が登録'
          },
          leaderboard: {
            experience: '経験値',
            points: 'ポイント',
            learning: '学習',
            rank: 'ランク',
            user: 'ユーザー'
          },
          login: {
            rememberMe: 'ログインを記憶',
            orLoginWith: 'または以下でログイン',
            wechat: 'WeChat',
            weibo: 'Weibo'
          },
          course: {
            courseDetail: 'コース詳細',
            loadingCourse: 'コースコンテンツを読み込み中...'
          },
          circle: {
            circleDetail: 'サークル詳細',
            loadingCircle: 'サークルコンテンツを読み込み中...'
          }
        }
      },
      ko: {
        translation: {
          common: {
            appName: '도라에몽 다국어 플랫폼',
            home: '홈',
            community: '커뮤니티',
            learning: '학습',
            messages: '메시지',
            profile: '프로필',
            login: '로그인',
            register: '회원가입',
            logout: '로그아웃',
            search: '검색',
            submit: '제출',
            cancel: '취소',
            save: '저장',
            edit: '편집',
            delete: '삭제',
            loading: '로딩 중...',
            noData: '데이터 없음',
            loadMore: '더 보기',
            back: '뒤로',
            publish: '게시'
          },
          auth: {
            email: '이메일',
            password: '비밀번호',
            confirmPassword: '비밀번호 확인',
            nickname: '닉네임',
            forgotPassword: '비밀번호를 잊으셨나요?',
            noAccount: '계정이 없으신가요?',
            hasAccount: '이미 계정이 있으신가요?',
            loginSuccess: '로그인 성공',
            registerSuccess: '가입 성공',
            loginFailed: '로그인 실패',
            registerFailed: '가입 실패'
          },
          community: {
            posts: '게시물',
            circles: '서클',
            createPost: '게시물 작성',
            postTitle: '제목',
            postContent: '내용',
            like: '좋아요',
            comment: '댓글',
            share: '공유',
            joinCircle: '서클 가입',
            leaveCircle: '서클 탈퇴',
            members: '멤버',
            postsCount: '게시물 수',
            tags: '태그 (쉼표로 구분)',
            tagsPlaceholder: '예: 환영, 소개, 도움',
            writeComment: '댓글 작성...',
            postComment: '댓글 게시',
            noComments: '아직 댓글이 없습니다. 첫 번째 댓글을 작성하세요!',
            pleaseLogin: '로그인해주세요'
          },
          learning: {
            courses: '코스',
            myCourses: '내 코스',
            progress: '진행률',
            beginner: '초급',
            intermediate: '중급',
            advanced: '고급',
            enroll: '등록',
            continue: '계속',
            completed: '완료',
            lesson: '레슨',
            exercise: '연습'
          },
          achievement: {
            level: '레벨',
            exp: '경험치',
            points: '포인트',
            badges: '배지',
            leaderboard: '랭킹',
            achievements: '성취'
          },
          profile: {
            uploadAvatar: '아바타 업로드',
            changeAvatar: '아바타 변경',
            invalidAvatarType: '이미지 파일(JPEG, PNG, GIF, WebP, SVG)만 지원',
            avatarTooLarge: '아바타 파일 크기는 5MB 이하여야 합니다',
            uploadFailed: '업로드 실패, 다시 시도해주세요',
            avatarHint: 'JPG, PNG, GIF, WebP, SVG 형식 지원, 최대 5MB',
            noCourses: '등록된 코스가 없습니다',
            noPosts: '게시물이 없습니다',
            noCircles: '가입한 서클이 없습니다'
          },
          messages: {
            messageList: '메시지 목록',
            officialAccount: '도라에몽 공식',
            welcomeMessage: '도라에몽 플랫폼에 오신 것을 환영합니다！',
            chatWindow: '채팅 창',
            selectConversation: '대화를 선택하여 채팅을 시작하세요',
            inputMessage: '메시지를 입력...',
            send: '전송'
          },
          home: {
            platformFeatures: '플랫폼 특징',
            hotCircles: '인기 서클',
            recommendedCourses: '추천 코스',
            joinNow: '지금 가입',
            browseCommunity: '커뮤니티 탐색',
            multilingualSupport: '다국어 지원',
            communityExchange: '커뮤니티 교환',
            languageLearning: '언어 학습',
            achievementSystem: '업적 시스템',
            multilingualDescription: '중국어, 영어, 일본어, 한국어 지원',
            communityDescription: '게시물 작성, 댓글, 관심 서클 가입',
            learningDescription: '풍부한 언어 코스로 쉽게 학습',
            achievementDescription: '레벨 배지, 포인트 보상, 랭킹 경쟁',
            heroTitle: '전 세계 도라에몽 팬을 연결하여 함께 배우고, 교환하고, 성장',
            members: '멤버',
            posts: '게시물',
            viewMoreCircles: '더 많은 서클 보기 →',
            viewMoreCourses: '더 많은 코스 보기 →',
            enrolled: '명이 등록'
          },
          leaderboard: {
            experience: '경험치',
            points: '포인트',
            learning: '학습',
            rank: '순위',
            user: '사용자'
          },
          login: {
            rememberMe: '로그인 기억',
            orLoginWith: '또는 다음으로 로그인',
            wechat: 'WeChat',
            weibo: 'Weibo'
          },
          course: {
            courseDetail: '코스 상세',
            loadingCourse: '코스 콘텐츠 로딩 중...'
          },
          circle: {
            circleDetail: '서클 상세',
            loadingCircle: '서클 콘텐츠 로딩 중...'
          }
        }
      }
    }
  });

export default i18n;
