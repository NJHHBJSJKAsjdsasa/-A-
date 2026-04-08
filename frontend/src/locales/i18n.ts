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
          }
        }
      }
    }
  });

export default i18n;
