import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { api } from '@/admin/services'
import { useToast } from '@/admin/context/ToastContext'
import { PageHeader, PageLoading, EmptyState, Button } from '@/admin/components/ui'
import VariantsManager from './VariantsManager'

/** Full-page variants control for one product — the Variants tab's Manage
    action navigates here; the products list only shows the read-only sheet. */
export default function ProductVariants() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: product, isSuccess, error, refetch } = useQuery({
    queryKey: [api.products.key, id],
    queryFn: () => api.products.get(id),
  })

  // Only a successful fetch that returned null is a real 404 — the service
  // rethrows every other failure, which gets an error state below instead
  // of a misleading "not found" redirect.
  useEffect(() => {
    if (isSuccess && !product) {
      toast.error('Not found', 'That product does not exist.')
      navigate('/products')
    }
  }, [isSuccess, product, navigate, toast])

  if (!product && error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load this product"
        body={error.message}
        action={
          <Button size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }
  if (!product) return <PageLoading />

  return (
    <>
      <PageHeader
        trail={[{ label: 'Products', to: '/products' }, { label: product.name, to: `/products/${id}/edit` }, { label: 'Variants' }]}
        eyebrow="Catalogue"
        title={`${product.name} — variants`}
        body={
          id === 'jupiter'
            ? 'The official SKU list. The six-digit code is the spec sheet — bays, drive capacity, drives installed.'
            : `Every variant listed here belongs to ${product.name} only — it feeds this family's model grid on the client site.`
        }
      />
      <VariantsManager product={product} />
    </>
  )
}
