export type FileType = 'validation_report' | 'pitch_deck' | 'video' | 'ai_image' | 'market_research' | 'user_upload';

export interface IdeaFile {
  id: string;
  idea_id: string;
  file_url: string;
  file_type: FileType;
  storage_provider: string;
  file_name: string;
  uploaded_at: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileUploadResponse {
  uploadUrl: string;
  fileUrl: string;
  fileName: string;
}

export interface FileGroup {
  type: FileType;
  icon: React.ReactNode;
  label: string;
  files: IdeaFile[];
}
