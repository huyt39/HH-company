import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './admin/AdminLayout'
import { AuthProvider } from './admin/AuthContext'
import ResourcePage from './admin/ResourcePage'
import Account from './admin/pages/Account'
import ContactInfoEditor from './admin/pages/ContactInfoEditor'
import Dashboard from './admin/pages/Dashboard'
import Login from './admin/pages/Login'
import Messages from './admin/pages/Messages'
import ProfileEditor from './admin/pages/ProfileEditor'
import Layout from './components/layout/Layout'
import About from './pages/About'
import ArticleDetail from './pages/ArticleDetail'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Fields from './pages/Fields'
import Financials from './pages/Financials'
import Home from './pages/Home'
import JobDetail from './pages/JobDetail'
import News from './pages/News'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import Projects from './pages/Projects'

export default function App() {
  return (
    <Routes>
      {/* ---------- Website công khai ---------- */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="gioi-thieu" element={<About />} />
        <Route path="linh-vuc" element={<Fields />} />
        <Route path="san-pham" element={<Products />} />
        <Route path="du-an" element={<Projects />} />
        <Route path="du-an/:slug" element={<ArticleDetail type="project" />} />
        <Route path="nang-luc-tai-chinh" element={<Financials />} />
        <Route path="tin-tuc" element={<News />} />
        <Route path="tin-tuc/:slug" element={<ArticleDetail type="news" />} />
        <Route path="tuyen-dung" element={<Careers />} />
        <Route path="tuyen-dung/:slug" element={<JobDetail />} />
        <Route path="lien-he" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---------- Khu vực quản trị ---------- */}
      <Route
        path="/admin/*"
        element={
          <AuthProvider>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfileEditor />} />
                <Route path="contact-info" element={<ContactInfoEditor />} />
                <Route path="messages" element={<Messages />} />
                <Route path="account" element={<Account />} />
                {/* Bảy tài nguyên dùng chung một trang CRUD */}
                <Route path=":resource" element={<ResourcePage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        }
      />
    </Routes>
  )
}
