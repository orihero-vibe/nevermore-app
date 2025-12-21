import { useMemo } from 'react';
import { Content } from '../services/content.service';

interface UseContentPresentationReturn {
  transcripts: string[];
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
        transcripts: [],
        images: [],
        displayImage: DEFAULT_IMAGE,
        audioFiles: [],
        hasAudio: false,
        hasTranscript: false,
        hasImages: false,
      };
    }

    const transcripts = content.transcripts || [];
    const images = content.images || [];
    const displayImage = images.length > 0 ? images[0] : DEFAULT_IMAGE;
    const audioFiles = content.files || [];

    return {
      transcripts,
      images,
      displayImage,
      audioFiles,
      hasAudio: audioFiles.length > 0,
      hasTranscript: transcripts.length > 0,
      hasImages: images.length > 0,
    };
  }, [content]);
}

