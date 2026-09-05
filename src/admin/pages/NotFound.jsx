import { Compass } from 'lucide-react'
import { Button, EmptyState } from '@/admin/components/ui'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        body="That admin route does not exist. The sidebar has everything that does."
        action={<Button to="/products">Back to products</Button>}
      />
    </div>
  )
}
