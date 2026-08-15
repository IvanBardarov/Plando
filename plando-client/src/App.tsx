import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Layout } from './components/Layout';
import { TasksPage } from './pages/TasksPage';
import { TaskListsPage } from './pages/TaskListsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskCategoriesPage } from './pages/TaskCategoriesPage';
import { TaskListDetailPage } from './pages/TaskListDetailPage';
import { TaskItemDetailPage } from './pages/TaskItemDetailPage';
import { TaskCategoryDetailPage } from './pages/TaskCategoryDetailPage';
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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/taskcategories" element={<TaskCategoriesPage />} />
          <Route path="/taskcategories/:id" element={<TaskCategoryDetailPage />} />
          <Route path="/tasklists/:id" element={<TaskListDetailPage />} />
          <Route path="/tasks/:id/details" element={<TaskItemDetailPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;