import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Course {
  _id: string;
  title: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
  titleKo: string;
  description: string;
  language: string;
  level: string;
  cover: string;
  enrolled: number;
}

interface LearningState {
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: unknown[];
  progress: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  progress: {},
  loading: false,
  error: null
};

export const fetchCourses = createAsyncThunk(
  'learning/fetchCourses',
  async ({ language, level }: { language?: string; level?: string } = {}) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (level) params.append('level', level);
    const response = await fetch(`/api/courses?${params.toString()}`);
    const data = await response.json();
    return data.data;
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      });
  }
});

export const { setCurrentCourse } = learningSlice.actions;
export default learningSlice.reducer;
