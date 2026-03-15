import React, { useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';

/**
 * ProtectedRoute - Redirects based on authentication state
 * - If user is NOT logged in: shows a popup then redirects to /about
 * - If user IS logged in: renders the protected component
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const { showPopup } = usePopup();

    // Show nothing while checking auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <RedirectWithPopup showPopup={showPopup} />;
    }

    return children;
};

/** Fires the popup in an effect so it runs after mount, then redirects. */
const RedirectWithPopup = ({ showPopup }) => {
    const hasShown = useRef(false);

    useEffect(() => {
        if (!hasShown.current) {
            hasShown.current = true;
            showPopup("Please log in to access this page.", "error");
        }
    }, []);

    return <Navigate to="/about" replace />;
};

/**
 * PublicRoute - For routes that should redirect authenticated users
 * - If user IS logged in: redirects to home (/)
 * - If user is NOT logged in: renders the component
 */
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
