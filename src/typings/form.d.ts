/** The global namespace for the app */
declare namespace Form {
  type FormComponentType = 'input' | 'select' | 'dateRange';

  interface SearchField {
    key: string;
    label: string;
    type: FormComponentType;
    placeholder?: string;
    options?: CommonType.Option<string>[];
    rules?: App.Global.FormRule[];
  }

  type SearchForm = SearchField[];
}
