import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import HomePage from './pages/HomePage/HomePage'
import JobPostPage from './pages/JobPostPage/JobPostPage'
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage'
import MyJobsPage from './pages/MyJobsPage/MyJobsPage'
import JobApplicationsPage from './pages/JobApplicationsPage/JobApplicationsPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { NavLinks } from './enums/NavLinks'
import { Role } from './enums/Role'

export const router = createBrowserRouter([
    {
        path: NavLinks.Home,
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: `${NavLinks.Jobs}/:id`,
                element: <JobPostPage />
            },
            {
                path: NavLinks.MyApplications,
                element: (
                    <ProtectedRoute allowedRoles={[Role.Candidate]}>
                        <MyApplicationsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: NavLinks.MyJobs,
                element: (
                    <ProtectedRoute allowedRoles={[Role.Employer]}>
                        <MyJobsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: `${NavLinks.MyJobs}/:id/applications`,
                element: (
                    <ProtectedRoute allowedRoles={[Role.Employer]}>
                        <JobApplicationsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: NavLinks.Profile,
                element: (
                    <ProtectedRoute allowedRoles={[Role.Candidate, Role.Employer]}>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            }
        ]
    }
])