export type FieldType = 'text' | 'number' | 'email' | 'textarea'| 'tel' | 'select'

export interface Schema {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    field_input: string
    placeHolder?: string | undefined;
    options?: string;
    validation?: FieldValidation | undefined;
}

export type FieldValidation = {
  required?: boolean
  max?: string
  min?: string
  pattern?: string
}