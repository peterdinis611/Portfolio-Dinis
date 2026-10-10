import { NotionRouteLoading } from '@/components/notion/NotionRouteLoading'

/** `loading.tsx` does not receive `params` — locale comes from the pathname client-side. */
export default function LocaleLoading() {
  return <NotionRouteLoading />
}
