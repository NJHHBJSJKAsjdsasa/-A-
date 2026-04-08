import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import Circles from './pages/Circles';
import CircleDetail from './pages/CircleDetail';
import Learning from './pages/Learning';
import CourseDetail from './pages/CourseDetail';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="community" element={<Community />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="circles" element={<Circles />} />
        <Route path="circles/:id" element={<CircleDetail />} />
        <Route path="learning" element={<Learning />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
