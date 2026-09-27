export type NotionPageId = 'about' | 'tech' | 'experience' | 'projects' | 'notes' | 'cv' | 'contact'

export type NotionPageDef = {
  id: NotionPageId
  icon: string
  label: string
}
