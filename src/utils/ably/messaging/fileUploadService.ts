
// Basic implementation for file uploads
export default {
  uploadFile: async (file: File, metadata: any) => {
    console.log('Uploading file', file.name, metadata);
    return {
      id: 'file-' + Date.now(),
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
      type: file.type
    };
  },
  getFileUrl: (fileId: string) => {
    return `/api/files/${fileId}`;
  }
};
