import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { CronJobs } from './pages/CronJobs';
import { Webhooks } from './pages/Webhooks';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> */}
          <Route
            path="/"
            element={
              // <PrivateRoute>
              <CronJobs />
              // </PrivateRoute>
            }
          />
          <Route
            path="/webhooks"
            element={
              // <PrivateRoute>
              <Webhooks />
              // </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;