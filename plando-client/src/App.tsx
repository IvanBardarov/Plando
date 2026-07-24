import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TaskListsPage } from './pages/TaskListsPage';
import { TaskListDetailPage } from './pages/TaskListDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="login" />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/dashboard" element={<DashboardPage />}/>
        <Route path="/tasklists" element={<TaskListsPage/>} />
        <Route path="/tasklists/:id" element={<TaskListDetailPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;