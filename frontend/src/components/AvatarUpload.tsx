import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getAvatarUrl } from '../utils/api';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const AvatarUpload = ({ currentAvatar, onAvatarChange }: AvatarUploadProps) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError(t('profile.invalidAvatarType'));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profile.avatarTooLarge'));
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const userId = user?._id;
      
      if (!token || !userId) {
        setError(t('auth.notAuthenticated'));
        return;
      }

      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        onAvatarChange(data.data.avatar);
      } else {
        setError(data.error?.message || t('profile.uploadFailed'));
      }
    } catch (err) {
      setError(t('profile.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Add timestamp to force image refresh and use full URL
  const avatarSrc = currentAvatar ? `${getAvatarUrl(currentAvatar)}?t=${Date.now()}` : undefined;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        {avatarSrc && !imgError ? (
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            className="w-full h-full object-cover"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">?</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
            {uploading ? t('common.uploading') : t('profile.changeAvatar')}
          </span>
        </div>

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleClick}
        disabled={uploading}
        className="btn-secondary text-sm"
      >
        {uploading ? t('common.uploading') : t('profile.uploadAvatar')}
      </button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <p className="text-gray-400 text-xs text-center">
        {t('profile.avatarHint')}
      </p>
    </div>
  );
};

export default AvatarUpload;
