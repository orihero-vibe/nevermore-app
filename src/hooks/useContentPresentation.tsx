import { useMemo } from 'react';
import { Content } from '../services/content.service';

interface UseContentPresentationReturn {
  transcript: string;
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
 * @returns Formatted presentation data
 */
export function useContentPresentation(content: Content | null): UseContentPresentationReturn {
  return useMemo(() => {
    if (!content) {
      return {
        transcript: '',
        images: [],
        displayImage: DEFAULT_IMAGE,
        audioFiles: [],
        hasAudio: false,
        hasTranscript: false,
        hasImages: false,
      };
    }

    const transcript = content.transcript || '';
    const images = content.images || [];
    const displayImage = images.length > 0 ? images[0] : DEFAULT_IMAGE;
    const audioFiles = content.files || [];

    return {
      transcript,
      images,
      displayImage,
      audioFiles,
      hasAudio: audioFiles.length > 0,
      hasTranscript: !!transcript,
      hasImages: images.length > 0,
    };
  }, [content]);
}

