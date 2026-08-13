import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Layout } from './components/Layout';
import { TasksPage } from './pages/TasksPage';
import { TaskListsPage } from './pages/TaskListsPage';
import { TaskListDetailPage } from './pages/TaskListDetailPage';
import { TaskItemDetailPage } from './pages/TaskItemDetailPage';
import { NoteDetailPage } from './pages/NoteDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="" element={<Layout />}>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasklists" element={<TaskListsPage />} />
        </Route>
        <Route path="/tasklists/:id" element={<TaskListDetailPage />} />
        <Route path="/tasks/:id/details" element={<TaskItemDetailPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;