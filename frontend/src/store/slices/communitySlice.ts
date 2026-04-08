import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Post {
  _id: string;
  authorId: { _id: string; nickname: string; avatar: string };
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

interface Circle {
  _id: string;
  name: string;
  description: string;
  cover: string;
  members: string[];
  posts: number;
}

interface CommunityState {
  posts: Post[];
  currentPost: Post | null;
  circles: Circle[];
  currentCircle: Circle | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  posts: [],
  currentPost: null,
  circles: [],
  currentCircle: null,
  loading: false,
  error: null
};

export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data.data;
  }
);

export const fetchCircles = createAsyncThunk(
  'community/fetchCircles',
  async () => {
    const response = await fetch('/api/circles');
    const data = await response.json();
    return data.data;
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchCircles.fulfilled, (state, action) => {
        state.circles = action.payload;
      });
  }
});

export const { setCurrentPost, clearCurrentPost } = communitySlice.actions;
export default communitySlice.reducer;
