import { useMemo } from 'react';
import { Content } from '../services/content.service';

interface UseContentPresentationReturn {
  mainContentURL: string | null;
  transcriptURL: string | null;
  images: string[];
  displayImage: string;
  audioFiles: string[];
  hasAudio: boolean;
  hasTranscript: boolean;
  hasImages: boolean;
}

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2023/10/30/12/36/hospital-8352776_640.jpg';

/**
 * Hook to extract and format presentation data from content
 * Provides a clean interface for accessing content display properties
 * 
 * @param content - The content object to extract data from
 * @param role - The selected role ('recovery' | 'support') to determine which URLs to use
 * @returns Formatted presentation data
 */
export function useContentPresentation(
  content: Content | null,
  role: 'recovery' | 'support' = 'recovery'
): UseContentPresentationReturn {
  return useMemo(() => {
    if (!content) {
      return {
        mainContentURL: null,
        transcriptURL: null,
        images: [],
        displayImage: DEFAULT_IMAGE,
        audioFiles: [],
        hasAudio: false,
        hasTranscript: false,
        hasImages: false,
      };
    }

    // Get role-specific URLs
    const mainContentURL = role === 'recovery' 
      ? content.mainContentRecoveryURL || null
      : content.mainContentSupportURL || null;
    
    const transcriptURL = role === 'recovery'
      ? content.transcriptRecoveryURL || null
      : content.transcriptSupportURL || null;

    const images = content.images || [];
    const displayImage = images.length > 0 ? images[0] : DEFAULT_IMAGE;
    const audioFiles = content.files || [];

    return {
      mainContentURL,
      transcriptURL,
      images,
      displayImage,
      audioFiles,
      hasAudio: audioFiles.length > 0,
      hasTranscript: !!transcriptURL,
      hasImages: images.length > 0,
    };
  }, [content, role]);
}

