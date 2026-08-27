import { Outlet, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToHash } from './components/ScrollToHash'
import { Home } from './pages/Home'
import { ProjectDetails } from './pages/ProjectDetails'
import { ProfileProvider } from './lib/ProfileProvider'
import { AuthProvider } from './admin/context/AuthProvider'
import { RequireAuth } from './admin/components/RequireAuth'
import { AdminLayout } from './admin/components/AdminLayout'
import { Login } from './admin/pages/Login'
import { Dashboard } from './admin/pages/Dashboard'
import { ProjectsList } from './admin/pages/projects/ProjectsList'
import { ProjectForm } from './admin/pages/projects/ProjectForm'
import { SkillsList } from './admin/pages/skills/SkillsList'
import { SkillForm } from './admin/pages/skills/SkillForm'
import { ExperienceList } from './admin/pages/experience/ExperienceList'
import { ExperienceForm } from './admin/pages/experience/ExperienceForm'
import { CertificationsList } from './admin/pages/certifications/CertificationsList'
import { CertificationForm } from './admin/pages/certifications/CertificationForm'
import { ProfileForm } from './admin/pages/profile/ProfileForm'

function PublicLayout() {
  return (
    <ProfileProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollToHash />

        <Navbar />

        <main className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </main>

        <Footer />
      </div>
    </ProfileProvider>
  )
}

function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="skills" element={<SkillsList />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/:id/edit" element={<SkillForm />} />
          <Route path="experience" element={<ExperienceList />} />
          <Route path="experience/new" element={<ExperienceForm />} />
          <Route path="experience/:id/edit" element={<ExperienceForm />} />
          <Route path="certifications" element={<CertificationsList />} />
          <Route path="certifications/new" element={<CertificationForm />} />
          <Route path="certifications/:id/edit" element={<CertificationForm />} />
          <Route path="profile" element={<ProfileForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
      </Route>
    </Routes>
  )
}

export default App
