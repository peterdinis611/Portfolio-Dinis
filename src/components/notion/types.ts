export type NotionPageId = 'about' | 'tech' | 'experience' | 'projects' | 'contact'

export type NotionPageDef = {
  id: NotionPageId
  icon: string
  label: string
}
