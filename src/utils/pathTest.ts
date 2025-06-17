// Example usage for the path diagnostic tool
import { logIdeaPaths } from '../utils/pathDiagnostic';

/**
 * This is a utility script to help debug S3 path issues
 * Run this file to see how the paths are being generated for different idea names.
 */

// Test different idea names and observe path generation
const testCases = [
  { id: 'test-id-1', name: 'My Awesome Idea' },
  { id: 'test-id-2', name: 'My Awesome Idea!' }, // Note the exclamation mark
  { id: 'test-id-3', name: 'My Awesome Idea with spaces and @special# characters' },
];

console.log('==== S3 Path Diagnostic Results ====');
testCases.forEach(test => {
  logIdeaPaths(test.id, test.name);
});
console.log('==================================');

/**
 * Instructions:
 * 
 * 1. Import this in a component where you're having issues
 * 2. Call logIdeaPaths(ideaId, ideaName) to see exactly where files will be stored
 * 3. Compare the paths with what's in your S3 bucket
 */
