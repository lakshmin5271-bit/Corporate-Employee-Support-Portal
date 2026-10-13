import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyRequests from './pages/MyRequests';
import RequestDetails from './pages/RequestDetails';
import CreateRequest from './pages/CreateRequest';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import { initialRequests } from './data/requests';
import './App.css';

/**
 * Main Application Component
 * Demonstrates:
 * - Centralized state management (Lifting state up to App level)
 * - React Router DOM setup (BrowserRouter, Routes, Route, Navigate)
 * - Dynamic route handling (/requests/:id)
 * - Passing state and state-mutator functions as Props to child routes
 * - Responsive layout orchestration with Navbar and collapsible Sidebar
 */
function App() {
  // Central Service Requests State (Lifting State Up)
  // Ensures updates in RequestDetails or CreateRequest propagate universally
  const [requests, setRequests] = useState(initialRequests);

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle mobile navigation sidebar
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  /**
   * Action Handler: Mark a request as Resolved
   * Synchronously updates ticket status in central state
   */
  const handleResolveRequest = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) => {
        if (req.id.toLowerCase() === requestId.toLowerCase()) {
          return {
            ...req,
            status: 'Resolved',
            resolutionNotes: `Resolution verified and approved on ${new Date().toLocaleDateString('en-GB')}.`
          };
        }
        return req;
      })
    );
  };

  /**
   * Action Handler: Add a newly submitted service request
   * Prepends new ticket to the state array
   */
  const handleAddRequest = (newRequest) => {
    setRequests((prevRequests) => [newRequest, ...prevRequests]);
  };

  // Dynamic calculation of counts for navigation badges
  const totalRequestsCount = requests.length;
  const openRequestsCount = requests.filter((r) => r.status === 'Open').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <BrowserRouter>
      <div className="portal-app-layout">
        {/* Top Enterprise Header */}
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          pendingCount={pendingRequestsCount} 
        />

        <div className="portal-body-wrapper">
          {/* Left Navigation Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleCloseSidebar}
            totalRequests={totalRequestsCount}
            openRequests={openRequestsCount}
          />

          {/* Main Application Content Area */}
          <main className="portal-main-content">
            <div className="content-inner-container">
              <Routes>
                {/* Default route redirects to /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Main Dashboard */}
                <Route 
                  path="/dashboard" 
                  element={<Dashboard requests={requests} />} 
                />

                {/* My Requests Ticket Desk */}
                <Route 
                  path="/my-requests" 
                  element={<MyRequests requests={requests} />} 
                />

                {/* Dynamic Route: Individual Ticket Details */}
                <Route 
                  path="/requests/:id" 
                  element={
                    <RequestDetails 
                      requests={requests} 
                      onResolveRequest={handleResolveRequest} 
                    />
                  } 
                />

                {/* Raise New Service Request */}
                <Route 
                  path="/create-request" 
                  element={<CreateRequest onAddRequest={handleAddRequest} />} 
                />

                {/* Company Announcements */}
                <Route 
                  path="/announcements" 
                  element={<Announcements />} 
                />

                {/* Employee Profile */}
                <Route 
                  path="/profile" 
                  element={<Profile requests={requests} />} 
                />

                {/* Fallback 404 Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
