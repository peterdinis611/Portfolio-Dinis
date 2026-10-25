export type NotionPageId =
  | 'about'
  | 'now'
  | 'tech'
  | 'experience'
  | 'projects'
  | 'notes'
  | 'oss'
  | 'uses'
  | 'cv'
  | 'contact'

export type NotionPageDef = {
  id: NotionPageId
  icon: string
  label: string
}
