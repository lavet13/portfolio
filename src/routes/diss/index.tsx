import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/diss/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/bio/"!</div>
}
