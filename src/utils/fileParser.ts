import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { IrishVisaStatus, IrishLocation } from '../types';

// Configure pdf.js worker URL for browser environments
if (typeof window !== 'undefined') {
  try {
    // Use unpkg CDN matching the installed version, or inline worker fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('pdf.js worker setup note:', e);
  }
}

export interface ExtractedFileResult {
  text: string;
  fileName: string;
  characterCount: number;
  wordCount: number;
}

export interface ParsedResumeProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: IrishLocation | string;
  eircode?: string;
  visaStatus?: IrishVisaStatus;
  linkedinUrl?: string;
  githubUrl?: string;
  headline?: string;
  summary?: string;
  experiences?: Array<{
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    highlights: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year?: string;
    grade?: string;
  }>;
  skills?: {
    technical: string[];
    domain: string[];
    tools: string[];
  };
  certifications?: string[];
}

/**
 * Robust Client-Side PDF text extractor using pdfjs-dist with fallback stream scanner
 */
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTextPromises: Promise<string>[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      pageTextPromises.push(
        pdfDocument.getPage(pageNum).then(async (page) => {
          const textContent = await page.getTextContent();
          let lastY: number | null = null;
          let pageString = '';

          for (const item of textContent.items as any[]) {
            if ('str' in item) {
              // Add newline when vertical coordinate changes significantly
              if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
                pageString += '\n';
              } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
                pageString += ' ';
              }
              pageString += item.str;
              lastY = item.transform[5];
            }
          }
          return pageString;
        })
      );
    }

    const pages = await Promise.all(pageTextPromises);
    const combined = pages.join('\n\n').trim();

    if (combined.length > 30) {
      return combined;
    }
  } catch (pdfErr) {
    console.warn('pdfjs extraction notice, trying stream scanner fallback:', pdfErr);
  }

  // Fallback: Pure JavaScript regex scanner over binary text streams for basic PDFs
  try {
    const uint8 = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const raw = decoder.decode(uint8);
    
    // Extract strings inside PDF text objects: /Tj, /TJ, (...) blocks
    const parenMatches = raw.match(/\(([^\r\n()]{2,150})\)/g) || [];
    if (parenMatches.length > 0) {
      const extracted = parenMatches
        .map(m => m.slice(1, -1).trim())
        .filter(s => s.length > 1 && !s.startsWith('/'))
        .join(' ');
      if (extracted.length > 40) {
        return extracted;
      }
    }
  } catch (rawErr) {
    console.warn('Raw stream fallback note:', rawErr);
  }

  throw new Error('Could not extract readable text from PDF. If this document is an image scan, please copy and paste your CV text into the box below.');
}

/**
 * Universal Client-Side Resume & Document Text Extractor
 * Works 100% offline and in serverless environments (Vercel, Netlify, Cloud Run)
 */
export async function extractTextFromFile(file: File): Promise<ExtractedFileResult> {
  const lowerName = file.name.toLowerCase();
  let extractedText = '';

  // 1. Plain Text / Markdown / CSV / JSON
  if (
    file.type === 'text/plain' ||
    file.type === 'text/markdown' ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.csv') ||
    lowerName.endsWith('.json')
  ) {
    extractedText = await file.text();
  }
  // 2. Word Documents (.docx) via Mammoth
  else if (lowerName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const docxResult = await mammoth.extractRawText({ arrayBuffer });
      extractedText = docxResult.value || '';
      if (!extractedText.trim()) {
        throw new Error('DOCX extracted empty text');
      }
    } catch (docxErr: any) {
      console.warn('Client mammoth extraction failed:', docxErr);
      throw new Error(`Failed to parse DOCX file (${docxErr?.message || 'invalid format'}). Try saving as PDF or pasting the text.`);
    }
  }
  // 3. Adobe PDF (.pdf) via pdfjs-dist with multi-level fallback
  else if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    extractedText = await extractTextFromPDF(arrayBuffer);
  }
  // 4. Legacy Word (.doc) or RTF
  else if (lowerName.endsWith('.doc') || lowerName.endsWith('.rtf') || file.type.includes('msword')) {
    try {
      // Try text reader first (handles RTF and plain formatted docs)
      const rawText = await file.text();
      const cleaned = rawText
        .replace(/\{\\[^{}]*\}/g, '')
        .replace(/\\['a-zA-Z0-9-]+/g, ' ')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleaned.length > 50) {
        extractedText = cleaned;
      } else {
        throw new Error('Legacy .doc format requires conversion');
      }
    } catch {
      throw new Error('Legacy .DOC binary format is best converted to .PDF or .DOCX. You can also copy and paste the text directly.');
    }
  } else {
    // Default try plain text reader
    extractedText = await file.text();
  }

  const cleanText = extractedText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (!cleanText || cleanText.length < 20) {
    throw new Error('Document contained very little or no readable text. Please paste the CV text directly into the box.');
  }

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return {
    text: cleanText,
    fileName: file.name,
    characterCount: cleanText.length,
    wordCount
  };
}

/**
 * Intelligent Profile Extractor from CV text
 * Extracts Name, Contact info, Eircode, Visa status, and structural sections.
 */
export function extractProfileFromText(text: string): ParsedResumeProfile {
  const profile: ParsedResumeProfile = {};
  if (!text || text.trim().length === 0) return profile;

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    profile.email = emailMatch[0];
  }

  // 2. Phone extraction (Irish & International patterns)
  const phoneMatch = text.match(/(?:\+353|00353|0)[\s.-]?(?:[1-9]\d{1,2})[\s.-]?(?:\d{3,4})[\s.-]?(?:\d{3,4})/) ||
                     text.match(/\+?\d{1,3}[\s.-]?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/);
  if (phoneMatch) {
    profile.phone = phoneMatch[0].trim();
  }

  // 3. LinkedIn extraction
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) {
    const raw = linkedinMatch[0];
    profile.linkedinUrl = raw.startsWith('http') ? raw : `https://${raw}`;
  }

  // 4. GitHub extraction
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) {
    const raw = githubMatch[0];
    profile.githubUrl = raw.startsWith('http') ? raw : `https://${raw}`;
  }

  // 5. Irish Eircode extraction (e.g. D02 X285, T12 AB34)
  const eircodeMatch = text.match(/\b([A-Za-z]\d{2}|[A-Za-z]{2}\d{2})\s?([A-Za-z0-9]{4})\b/);
  if (eircodeMatch) {
    profile.eircode = `${eircodeMatch[1].toUpperCase()} ${eircodeMatch[2].toUpperCase()}`;
  }

  // 6. Irish Visa / Work Authorization extraction
  const lowerText = text.toLowerCase();
  if (lowerText.includes('stamp 1g') || lowerText.includes('stamp1g') || lowerText.includes('third level graduate scheme')) {
    profile.visaStatus = 'Stamp 1G';
  } else if (lowerText.includes('stamp 4') || lowerText.includes('stamp4') || lowerText.includes('permanent residency')) {
    profile.visaStatus = 'Stamp 4';
  } else if (lowerText.includes('eu citizen') || lowerText.includes('irish citizen') || lowerText.includes('eea citizen') || lowerText.includes('stamp 1') || lowerText.includes('critical skills')) {
    profile.visaStatus = lowerText.includes('eu citizen') || lowerText.includes('irish citizen') ? 'EU/EEA Citizen' : 'Stamp 1 (CSEP)';
  } else if (lowerText.includes('stamp 2') || lowerText.includes('student visa')) {
    profile.visaStatus = 'Stamp 2 (Student)';
  }

  // 7. Irish Location extraction
  if (lowerText.includes('dublin')) profile.location = 'Dublin';
  else if (lowerText.includes('cork')) profile.location = 'Cork';
  else if (lowerText.includes('galway')) profile.location = 'Galway';
  else if (lowerText.includes('limerick')) profile.location = 'Limerick';
  else if (lowerText.includes('waterford')) profile.location = 'Waterford';

  // 8. Candidate Full Name extraction (from top 4 lines, ignoring headers/links)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Skip lines with email, urls, phone, or section labels
    if (
      !line.includes('@') &&
      !line.toLowerCase().includes('http') &&
      !line.toLowerCase().includes('curriculum vitae') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('phone') &&
      !line.toLowerCase().includes('email') &&
      line.length >= 3 &&
      line.length <= 40 &&
      !/^\d/.test(line)
    ) {
      // Clean up common prefixes like "Name:" or "Candidate:"
      const cleanName = line.replace(/^(name|candidate|profile):\s*/i, '').trim();
      if (cleanName.split(' ').length >= 2) {
        profile.fullName = cleanName;
        break;
      }
    }
  }

  return profile;
}
