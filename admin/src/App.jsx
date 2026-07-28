import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from '@/context/AuthContext'
import AdminLayout from '@/layouts/AdminLayout'

import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/pages/Dashboard'

import ProductsList from '@/modules/products/ProductsList'
import ProductForm from '@/modules/products/ProductForm'
import ModelsList from '@/modules/models/ModelsList'
import ChassisList from '@/modules/chassis/ChassisList'
import ChassisForm from '@/modules/chassis/ChassisForm'
import AccessoriesList from '@/modules/accessories/AccessoriesList'
import CategoriesList from '@/modules/categories/CategoriesList'
import SolutionsList from '@/modules/solutions/SolutionsList'
import ResourcesList from '@/modules/resources/ResourcesList'
import HeroList from '@/modules/hero/HeroList'
import HeroForm from '@/modules/hero/HeroForm'
import EnquiriesList from '@/modules/enquiries/EnquiriesList'
import CompanyEditor from '@/modules/content/CompanyEditor'
import ContactEditor from '@/modules/content/ContactEditor'
import NavigationEditor from '@/modules/content/NavigationEditor'
import FooterEditor from '@/modules/content/FooterEditor'
import SeoEditor from '@/modules/content/SeoEditor'
import MediaLibrary from '@/modules/media/MediaLibrary'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Catalogue */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="models" element={<ModelsList />} />
        <Route path="chassis" element={<ChassisList />} />
        <Route path="chassis/new" element={<ChassisForm />} />
        <Route path="chassis/:id/edit" element={<ChassisForm />} />
        <Route path="accessories" element={<AccessoriesList />} />
        <Route path="categories" element={<CategoriesList />} />

        {/* Content */}
        <Route path="hero" element={<HeroList />} />
        <Route path="hero/new" element={<HeroForm />} />
        <Route path="hero/:id/edit" element={<HeroForm />} />
        <Route path="solutions" element={<SolutionsList />} />
        <Route path="resources" element={<ResourcesList />} />
        <Route path="content/company" element={<CompanyEditor />} />
        <Route path="content/contact" element={<ContactEditor />} />

        {/* Site */}
        <Route path="site/navigation" element={<NavigationEditor />} />
        <Route path="site/footer" element={<FooterEditor />} />
        <Route path="site/seo" element={<SeoEditor />} />
        <Route path="media" element={<MediaLibrary />} />

        {/* Inbox */}
        <Route path="enquiries" element={<EnquiriesList />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
