/// <reference types="vite/client" />

// API configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://49.232.170.26:8080';

export const getApiUrl = (path: string): string => {
  // If path already starts with http, return as is
  if (path.startsWith('http')) {
    return path;
  }
  // Otherwise, prepend API base URL
  return `${API_BASE_URL}${path}`;
};

export const getAvatarUrl = (avatarPath?: string): string => {
  if (!avatarPath) {
    return `${API_BASE_URL}/avatars/default.svg`;
  }
  // If avatar path already starts with http, return as is
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  // Otherwise, prepend API base URL
  return `${API_BASE_URL}${avatarPath}`;
};
