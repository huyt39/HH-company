import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/admin/admin-layout'
import { SiteLayout } from '@/components/layout/site-layout'
import { AuthProvider } from '@/lib/auth/auth-context'
import { AboutPage } from '@/pages/about/about-page'
import { AccountPage } from '@/pages/admin/account/account-page'
import { CompanyProfilePage } from '@/pages/admin/company-profile/company-profile-page'
import { ContactInfoPage } from '@/pages/admin/contact-info/contact-info-page'
import { DashboardPage } from '@/pages/admin/dashboard/dashboard-page'
import { LoginPage } from '@/pages/admin/login/login-page'
import { MessagesPage } from '@/pages/admin/messages/messages-page'
import { ResourcePage } from '@/pages/admin/resource/resource-page'
import { ArticleDetailPage } from '@/pages/article/article-detail-page'
import { CareersPage } from '@/pages/careers/careers-page'
import { JobDetailPage } from '@/pages/careers/job-detail-page'
import { ContactPage } from '@/pages/contact/contact-page'
import { FieldsPage } from '@/pages/fields/fields-page'
import { FinancialsPage } from '@/pages/financials/financials-page'
import { HomePage } from '@/pages/home/home-page'
import { NewsPage } from '@/pages/news/news-page'
import { NotFoundPage } from '@/pages/not-found/not-found-page'
import { ProductsPage } from '@/pages/products/products-page'
import { ProjectsPage } from '@/pages/projects/projects-page'

/** Split out so only the admin area is wrapped in AuthProvider. */
function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<CompanyProfilePage />} />
          <Route path="contact-info" element={<ContactInfoPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="account" element={<AccountPage />} />
          {/* Seven resources share one CRUD page */}
          <Route path=":resource" element={<ResourcePage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export function App() {
  return (
    <Routes>
      {/* ---------- Public site ---------- */}
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="gioi-thieu" element={<AboutPage />} />
        <Route path="linh-vuc" element={<FieldsPage />} />
        <Route path="san-pham" element={<ProductsPage />} />
        <Route path="du-an" element={<ProjectsPage />} />
        <Route path="du-an/:slug" element={<ArticleDetailPage type="project" />} />
        <Route path="nang-luc-tai-chinh" element={<FinancialsPage />} />
        <Route path="tin-tuc" element={<NewsPage />} />
        <Route path="tin-tuc/:slug" element={<ArticleDetailPage type="news" />} />
        <Route path="tuyen-dung" element={<CareersPage />} />
        <Route path="tuyen-dung/:slug" element={<JobDetailPage />} />
        <Route path="lien-he" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ---------- Admin area ---------- */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}
