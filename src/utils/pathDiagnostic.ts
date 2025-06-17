import { getIdeaBasePath } from "../services/fileManager";

/**
 * A utility function to help diagnose file paths and ensure consistency
 * This can be imported and used in any component to see where files would be stored
 */
export function logIdeaPaths(ideaId: string, ideaName: string): void {
  const basePath = getIdeaBasePath(ideaId, ideaName);
  
  // Log to console for easier debugging during development
  console.log('🔍 Idea Path Diagnostic:', {
    ideaId,
    ideaName,
    basePath,
    imagePath: `${basePath}/images/example.jpg`,
    documentPath: `${basePath}/pitch_deck/example.pdf`,
  });
}
