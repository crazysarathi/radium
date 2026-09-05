import { Routes, Route } from 'react-router-dom'
import { RequireAuth, RequireAdmin } from '@/admin/context/AuthContext'
import AdminLayout from '@/admin/layouts/AdminLayout'

import Login from '@/admin/pages/Login'
import NotFound from '@/admin/pages/NotFound'
import Dashboard from '@/admin/pages/Dashboard'
import History from '@/admin/pages/History'

import ProductsList from '@/admin/modules/products/ProductsList'
import ProductForm from '@/admin/modules/products/ProductForm'
import ProductVariants from '@/admin/modules/products/ProductVariants'
import AccessoriesList from '@/admin/modules/accessories/AccessoriesList'
import VariantsList from '@/admin/modules/variants/VariantsList'
import CategoriesList from '@/admin/modules/categories/CategoriesList'
import EnquiriesList from '@/admin/modules/enquiries/EnquiriesList'
import UsersList from '@/admin/modules/users/UsersList'
import UserForm from '@/admin/modules/users/UserForm'

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
        {/* Overview — the console landing page */}
        <Route index element={<Dashboard />} />

        {/* Products — quick views open in a side sheet; the Variants tab's
            Manage action navigates to the per-product control page */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="products/:id/variants" element={<ProductVariants />} />

        {/* Category lookup behind the product form and site filters */}
        <Route path="categories" element={<CategoriesList />} />

        {/* Product-based accessories, full catalogue */}
        <Route path="accessories" element={<AccessoriesList />} />

        {/* All variants across families — management links back to each product */}
        <Route path="variants" element={<VariantsList />} />

        {/* Inbox */}
        <Route path="enquiries" element={<EnquiriesList />} />

        {/* Activity log */}
        <Route path="history" element={<History />} />

        {/* User management — administrators only */}
        <Route path="users" element={<RequireAdmin><UsersList /></RequireAdmin>} />
        <Route path="users/new" element={<RequireAdmin><UserForm /></RequireAdmin>} />
        <Route path="users/:id/edit" element={<RequireAdmin><UserForm /></RequireAdmin>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
