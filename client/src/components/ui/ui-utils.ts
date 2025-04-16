// Common utility functions and constants for UI components

export const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const slideInFromTopAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const slideInFromRightAnimation = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export const primaryColor = '#10B981';
export const primaryDarkColor = '#064E3B';
export const primaryLightColor = '#34D399';

export const lightColors = {
  background: '#F9FAFB',
  foreground: '#111827',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral500: '#6B7280',
  neutral900: '#111827',
};

export function getFileIcon(fileType: string): string {
  const fileExtension = fileType.toLowerCase().split('/').pop();
  
  switch (fileExtension) {
    case 'pdf':
      return 'ri-file-pdf-line';
    case 'doc':
    case 'docx':
      return 'ri-file-word-line';
    case 'xls':
    case 'xlsx':
      return 'ri-file-excel-line';
    case 'ppt':
    case 'pptx':
      return 'ri-file-ppt-line';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'ri-image-line';
    case 'zip':
    case 'rar':
      return 'ri-file-zip-line';
    default:
      return 'ri-file-text-line';
  }
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'user':
      return 'User';
    default:
      return role;
  }
}
