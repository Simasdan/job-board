import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import JobPostPage from './pages/JobPostPage/JobPostPage';
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage';
import MyJobsPage from './pages/MyJobsPage/MyJobsPage';
import JobApplicationsPage from './pages/JobApplicationsPage/JobApplicationsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'jobs/:id',
                element: <JobPostPage />
            },
            {
                path: 'my-applications',
                element: (
                    <ProtectedRoute allowedRoles={['Candidate']}>
                        <MyApplicationsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'my-jobs',
                element: (
                    <ProtectedRoute allowedRoles={['Employer']}>
                        <MyJobsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'my-jobs/:id/applications',
                element: (
                    <ProtectedRoute allowedRoles={['Employer']}>
                        <JobApplicationsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute allowedRoles={['Candidate', 'Employer']}>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            }
        ]
    }
])