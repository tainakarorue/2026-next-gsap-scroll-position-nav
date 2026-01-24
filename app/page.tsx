import { ScrollNav } from '@/components/scroll-nav'

export default function Page() {
  return (
    <>
      <ScrollNav />

      {['section-1', 'section-2', 'section-3'].map((id) => (
        <section key={id} id={id} className="min-h-screen">
          {id}
        </section>
      ))}
    </>
  )
}
