/** The global namespace for the app */
declare namespace Form {
  type FormComponentType = 'input' | 'select' | 'dateRange' | 'radio' | 'upload';

  interface SearchField {
    key: string;
    label: string;
    type: FormComponentType;
    placeholder?: string;
    options?: CommonType.Option<string>[];
    rules?: App.Global.FormRule[];
  }

  type SearchForm = SearchField[];

  interface FormField {
    key: string;
    label: string;
    type: FormComponentType;
    placeholder?: string;
    options?: CommonType.Option<string>[];
    required?: boolean;
    rules?: App.Global.FormRule[];
    hide?: boolean;
    disabled?: boolean;
  }

  type ConfigForm = FormField[];
}
