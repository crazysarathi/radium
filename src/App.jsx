import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import WelcomeDialog from '@/components/WelcomeDialog'
import CatalogueGate from '@/components/CatalogueGate'
import { CatalogueProvider } from '@/context/CatalogueContext'
import { CompareProvider } from '@/components/compare/CompareContext'
import CompareBar from '@/components/compare/CompareBar'
import { EnquiryProvider } from '@/components/enquiry/EnquiryContext'
import EnquiryDrawer from '@/components/enquiry/EnquiryDrawer'
import { SmoothScroll, ScrollManager, RevealObserver } from '@/components/SiteEffects'
import Home from '@/pages/Home'

// Landing page stays in the entry chunk — a lazy landing route suspends on
// first paint and produces a large CLS. Everything else is code-split.
const Products = lazy(() => import('@/pages/Products'))
const ProductFamily = lazy(() => import('@/pages/ProductFamily'))
const ModelDetail = lazy(() => import('@/pages/ModelDetail'))
const Company = lazy(() => import('@/pages/Company'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-beam/25 border-t-beam" role="status" aria-label="Loading" />
    </div>
  )
}

export default function App() {
  return (
    <CatalogueProvider>
      <CompareProvider>
        <EnquiryProvider>
          <SmoothScroll />
          <ScrollManager />
          <RevealObserver />
          <Header />
          <main id="main">
            <CatalogueGate>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductFamily />} />
                  <Route path="/products/:slug/:code" element={<ModelDetail />} />
                  <Route path="/company" element={<Company />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </CatalogueGate>
          </main>
          <Footer />
          <BackToTop />
          <CompareBar />
          <EnquiryDrawer />
          <WelcomeDialog />
        </EnquiryProvider>
      </CompareProvider>
    </CatalogueProvider>
  )
}
