export type ContentFormatType = 'hash' | 'string' | 'rawBase64';

export interface ContentFormatOption {
  value: ContentFormatType;
  label: string;
}

export const CONTENT_FORMAT_OPTIONS: ContentFormatOption[] = [
  { value: 'hash', label: 'Hash' },
  { value: 'string', label: 'String' },
  { value: 'rawBase64', label: 'Raw Base64' },
];
