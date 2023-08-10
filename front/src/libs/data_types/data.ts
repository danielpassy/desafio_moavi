export interface FileUploadRecord {
  id: number;
  file_name: string;
  uploaded_at: string;
  number_of_entries: number;
}

export interface simpleFileRecord {
  file_name: string;
  id: number;
}

export interface EscalaRecord {
  id: number;
  file: simpleFileRecord;
  matricula_colaborador: string;
  timestamp: Date;
}
