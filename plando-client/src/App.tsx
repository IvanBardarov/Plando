import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { TaskListsPage } from './pages/TaskListsPage';
import { TaskListDetailPage } from './pages/TaskListDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="login" />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/tasks" element={<TasksPage />}/>
        <Route path="/tasklists" element={<TaskListsPage/>}/>
        <Route path="/tasklists/:id" element={<TaskListDetailPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;