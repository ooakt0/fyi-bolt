import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileType, IdeaFile, FileGroup } from '../../types/fileTypes';
import log from '../../utils/logger';
import {
  File,
  FileImage,
  FileVideo,
  FileText,
  Presentation,
  Upload,
  Lock,
  Unlock,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  fetchIdeaFiles,
  getFileUploadUrl,
  saveFileMetadata,
  uploadFileToS3,
  getSignedFileUrl,
  toggleFilePrivacy
} from '../../services/fileManager';

interface FileManagerProps {
  ideaId: string;
  ideaName: string;
  creatorId: string;
  currentUserId: string;
}

const FileManager: React.FC<FileManagerProps> = ({ ideaId, ideaName, creatorId, currentUserId }) => {
  // Determine if current user is the creator of this specific idea
  const isIdeaCreator = currentUserId === creatorId;  const [files, setFiles] = useState<IdeaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFileType, setUploadingFileType] = useState<FileType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileGroups: FileGroup[] = [
    { type: 'validation_report', icon: <FileText />, label: 'Validation Reports', files: [] },
    { type: 'pitch_deck', icon: <Presentation />, label: 'Pitch Decks', files: [] },
    { type: 'video', icon: <FileVideo />, label: 'Videos', files: [] },
    { type: 'ai_image', icon: <FileImage />, label: 'AI Images', files: [] },
    { type: 'market_research', icon: <File />, label: 'Market Research', files: [] },
    { type: 'user_upload', icon: <Upload />, label: 'Other Uploads', files: [] },
  ];

  useEffect(() => {
    loadFiles();
  }, [ideaId]);

  // Add new effect to clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      // Cleanup timer on unmount or when error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadFiles = async () => {
    log.info('Loading files for idea', {
      action: 'loadFiles',
      ideaId
    });

    try {
      setLoading(true);
      const ideaFiles = await fetchIdeaFiles(ideaId);
      setFiles(ideaFiles);
      log.info('Successfully loaded files', {
        action: 'loadFiles',
        ideaId,
        fileCount: ideaFiles.length
      });
    } catch (err) {
      log.error('Failed to load files', {
        action: 'loadFiles',
        ideaId,
        error: err
      });
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Security check - ensure current user is the idea creator
    if (currentUserId !== creatorId) {
      setError('Permission denied: Only the creator of this idea can upload files');
      return;
    }

    log.info('Starting file upload', {
      action: 'handleFileUpload',
      ideaId,
      fileName: file.name,
      fileSize: file.size,
      fileType,
      userId: currentUserId
    });

    try {
      // Set which file type is currently uploading
      setUploadingFileType(fileType);
      setError(null);      // Get pre-signed URL
      const { uploadUrl, fileUrl, fileName } = await getFileUploadUrl(ideaId, ideaName, fileType, file.name);

      // Upload file to S3
      await uploadFileToS3(uploadUrl, file);

      // Save metadata to Supabase
      await saveFileMetadata(ideaId, fileUrl, fileType, fileName);

      log.info('Successfully completed file upload', {
        action: 'handleFileUpload',
        ideaId,
        fileName: file.name,
        fileType
      });

      await loadFiles(); // Reload files after upload
    } catch (err) {
      log.error('Failed to upload file', {
        action: 'handleFileUpload',
        ideaId,
        fileName: file.name,
        error: err
      });
      setError('Failed to upload file');
    } finally {
      // Clear uploading state
      setUploadingFileType(null);
    }
  };
  const handlePrivacyToggle = async (file: IdeaFile) => {
    // Security check - ensure current user is the idea creator
    if (currentUserId !== creatorId) {
      setError('Permission denied: Only the creator of this idea can change file privacy settings');
      return;
    }

    log.info('Toggling file privacy', {
      action: 'handlePrivacyToggle',
      ideaId,
      fileId: file.id,
      fileName: file.file_name,
      currentPrivacy: file.is_private,
      userId: currentUserId
    });

    try {
      await toggleFilePrivacy(file.id, !file.is_private);
      log.info('Successfully toggled file privacy', {
        action: 'handlePrivacyToggle',
        ideaId,
        fileId: file.id,
        fileName: file.file_name,
        newPrivacy: !file.is_private
      });
      await loadFiles();
    } catch (err) {
      log.error('Failed to update file privacy', {
        action: 'handlePrivacyToggle',
        ideaId,
        fileId: file.id,
        error: err
      });
      setError('Failed to update file privacy');
    }
  };
  const openFile = async (file: IdeaFile) => {
    log.info('Opening file', {
      action: 'openFile',
      ideaId,
      fileId: file.id,
      fileName: file.file_name,
      isPrivate: file.is_private
    });

    try {
      // Always get a signed URL regardless of is_private status
      // S3 objects with private ACL require signed URLs to access
      const url = await getSignedFileUrl(file.file_url);
      window.open(url, '_blank');
      log.info('Successfully opened file', {
        action: 'openFile',
        ideaId,
        fileId: file.id,
        fileName: file.file_name
      });
    } catch (err) {
      log.error('Failed to open file', {
        action: 'openFile',
        ideaId,
        fileId: file.id,
        error: err
      });
      setError('Failed to open file');
    }
  };

  // Helper function to format file name for display
  const formatDisplayFileName = (fileName: string): string => {
    // Extract the original part of the filename (before the timestamp)
    const parts = fileName.split('_');
    if (parts.length > 1) {
      // If filename contains timestamp separator (_)
      // Try to extract timestamp and reconstruct original name
      const timestampPart = parts[parts.length - 1];
      // Check if the last part is likely a timestamp (contains only numbers)
      if (/^\d+\.\w+$/.test(timestampPart)) {
        // Return everything except the timestamp part
        return parts.slice(0, parts.length - 1).join('_');
      }
    }
    // If we can't parse it, return the original filename
    return fileName;
  };
  // Group files by type and filter based on privacy
  const groupedFiles = fileGroups.map(group => ({
    ...group,
    files: files.filter(file => {
      // Filter by file type
      const fileTypeMatch = file.file_type === group.type;
      
      // Privacy filter: if file is private, only show to creator
      const privacyFilter = !file.is_private || isIdeaCreator;
      
      return fileTypeMatch && privacyFilter;
    })
  }));
  // For non-creators, check if there are hidden files in each group
  const privateFilesByGroup: Partial<Record<FileType, number>> = {};
  
  if (!isIdeaCreator) {
    fileGroups.forEach(group => {
      const allFilesOfType = files.filter(file => file.file_type === group.type);
      const privateFilesOfType = allFilesOfType.filter(file => file.is_private);
      
      if (privateFilesOfType.length > 0) {
        privateFilesByGroup[group.type] = privateFilesOfType.length;
      }
    });
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white mb-4">File Manager</h3>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {groupedFiles.map((group) => (
          <motion.div
            key={group.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">{group.icon}</span>
                <h4 className="text-lg font-medium">{group.label}</h4>
              </div>              {isIdeaCreator && (
                <label 
                  className={`cursor-pointer flex items-center justify-center ${
                    uploadingFileType === group.type 
                      ? 'bg-blue-500/40' 
                      : 'bg-blue-500/20 hover:bg-blue-500/30 hover:scale-105'
                  } text-blue-400 w-9 h-9 rounded-full transition-all duration-200`}
                  title={uploadingFileType === group.type ? 'Uploading...' : 'Upload file'}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, group.type)}
                    disabled={uploadingFileType !== null}
                  />
                  {uploadingFileType === group.type ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </label>
              )}
            </div>            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : group.files.length === 0 ? (
              <div>
                {!isIdeaCreator && privateFilesByGroup[group.type] ? (
                  <div className="text-yellow-500/70 text-sm flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    {privateFilesByGroup[group.type] === 1 ? 
                      '1 private file is hidden' : 
                      `${privateFilesByGroup[group.type]} private files are hidden`}
                  </div>
                ) : (
                  <div className="text-gray-400">No files uploaded</div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {group.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openFile(file)}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span title={file.file_name}>{formatDisplayFileName(file.file_name)}</span>
                      </button>
                    </div>                    <div className="flex items-center space-x-2">
                      {isIdeaCreator && (
                        <button
                          onClick={() => handlePrivacyToggle(file)}
                          className={`p-2 rounded-lg transition-colors ${
                            file.is_private
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {file.is_private ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      )}
                      {!isIdeaCreator && file.is_private && (
                        <span className="text-yellow-400 p-2">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;
