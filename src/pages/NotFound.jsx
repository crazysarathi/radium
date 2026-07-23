import { Section, Button, SplitText } from '@/components/ui'

export default function NotFound() {
  return (
    <Section className="pt-44">
      <div className="glass mx-auto max-w-xl p-12 text-center">
        <p className="font-mono text-[13px] uppercase tracking-[.2em] text-beam/70">Error 404</p>
        <SplitText as="h1" gradient text="Bay not found" className="t-h2 mt-4" />
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          The page you asked for is not installed in this chassis. Check the address, or
          head back to the product line.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Back to home</Button>
          <Button to="/products" variant="outline">Browse products</Button>
        </div>
      </div>
    </Section>
  )
}
