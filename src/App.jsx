import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import IngestionDashboard from './modules/ingestion/IngestionDashboard';
import ProcessingCanvas from './modules/processing/ProcessingCanvas';
import ModelingList from './modules/modeling/ModelingList';
import AnalysisDashboard from './modules/analysis/AnalysisDashboard';
import ReferenceManagement from './modules/reference/ReferenceManagement';
import ApiDashboard from './modules/api/ApiDashboard';
import SecurityDashboard from './modules/security/SecurityDashboard';
import PlayoutControl from './modules/playout/PlayoutControl';
import SystemDashboard from './modules/system/SystemDashboard';

export const UserContext = createContext();

function App() {
  const [userRole, setUserRole] = useState('admin'); // 'admin' or 'user'

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      <Router>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/ingestion" replace />} />
            <Route path="ingestion" element={<IngestionDashboard />} />
            <Route path="processing" element={<ProcessingCanvas />} />
            <Route path="modeling" element={<ModelingList />} />
            <Route path="analysis" element={<AnalysisDashboard />} />
            <Route path="reference" element={<ReferenceManagement />} />
            <Route path="api" element={<ApiDashboard />} />
            <Route path="security" element={<SecurityDashboard />} />
            <Route path="playout" element={<PlayoutControl />} />
            <Route path="system" element={<SystemDashboard />} />
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
