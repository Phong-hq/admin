export enum SCHEMAS {
  RELATION = 'relation',
  FILE = 'file',
  EMAIL = 'email',
  SELECT = 'select',
  TEXT = 'text',
  EDITOR = 'editor',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  URL = 'url',
  JSON = 'json',
  DATE_TIME = 'date_time'
}
export type SCHEMAS_TYPE = (typeof SCHEMAS)[keyof typeof SCHEMAS]
