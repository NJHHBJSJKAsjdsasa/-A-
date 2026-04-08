export interface User {
    _id: string;
    email: string;
    phone?: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    nickname: string;
    avatar: string;
    language: Language;
    oauthProviders: OAuthProvider[];
    level: number;
    exp: number;
    points: number;
    badges: string[];
    createdAt: Date;
    updatedAt: Date;
}
export type Language = 'zh' | 'en' | 'ja' | 'ko';
export interface OAuthProvider {
    provider: 'wechat' | 'qq' | 'weibo' | 'google';
    providerId: string;
}
export interface Post {
    _id: string;
    authorId: string;
    title: string;
    content: string;
    images: string[];
    videos: string[];
    circleId?: string;
    tags: string[];
    likes: number;
    comments: number;
    language: Language;
    createdAt: Date;
    updatedAt: Date;
}
export interface Comment {
    _id: string;
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
    likes: number;
    createdAt: Date;
}
export interface Circle {
    _id: string;
    name: string;
    description: string;
    cover: string;
    ownerId: string;
    members: string[];
    posts: number;
    language: Language;
    createdAt: Date;
}
export interface Conversation {
    _id: string;
    type: 'private' | 'group';
    participants: string[];
    name?: string;
    avatar?: string;
    lastMessage?: LastMessage;
    createdAt: Date;
}
export interface LastMessage {
    content: string;
    senderId: string;
    createdAt: Date;
}
export interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    type: 'text' | 'image' | 'video' | 'file';
    content: string;
    readBy: string[];
    createdAt: Date;
}
export interface Badge {
    _id: string;
    name: string;
    nameZh: string;
    nameEn: string;
    nameJa: string;
    nameKo: string;
    description: string;
    descriptionEn: string;
    icon: string;
    category: 'learning' | 'social' | 'contribution';
    condition: BadgeCondition;
    points: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
export interface BadgeCondition {
    type: string;
    value: number;
}
export interface UserAchievement {
    _id: string;
    userId: string;
    badgeId: string;
    unlockedAt: Date;
}
export interface Course {
    _id: string;
    title: string;
    description: string;
    language: 'en' | 'ja' | 'ko';
    level: 'beginner' | 'intermediate' | 'advanced';
    lessons: string[];
    cover: string;
    duration: number;
    enrolled: number;
    createdAt: Date;
}
export interface Lesson {
    _id: string;
    courseId: string;
    title: string;
    content: string;
    audio?: string;
    video?: string;
    exercises: Exercise[];
    order: number;
}
export interface Exercise {
    _id: string;
    type: 'choice' | 'fill' | 'match' | 'speak';
    question: string;
    options?: string[];
    answer: string;
    points: number;
}
export interface UserProgress {
    _id: string;
    userId: string;
    courseId: string;
    lessonId: string;
    completed: boolean;
    score: number;
    completedAt?: Date;
}
export interface File {
    _id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploaderId: string;
    folder: string;
    createdAt: Date;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}
export interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}
export interface PaginatedQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
//# sourceMappingURL=types.d.ts.map