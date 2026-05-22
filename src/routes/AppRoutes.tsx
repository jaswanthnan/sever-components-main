import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../views/Home/Home';
import Dashboard from '../views/Dashboard/Dashboard';
import Candidates from '../views/Candidates/Candidates';
import Jobs from '../views/Jobs/Jobs';
import Login from '../views/Login/Login';
import Register from '../views/Register/Register';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../views/NotFound/NotFound';
import PatternsDemo from '../views/PatternsDemo';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* Protected Routes */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="candidates" 
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            } 
          />
          
          {/* Unprotected but contains protected actions inside */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="patterns" element={<PatternsDemo />} />
        </Route>
        
        {/* Catch-All 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
