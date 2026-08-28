import jsPDF from 'jspdf';
import { TailoredResume, TailoredCoverLetter } from '../types';

export function exportResumeToPDF(resume: TailoredResume) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(resume.personalInfo.fullName.toUpperCase(), margin, y);
  y += 6;

  // Role Headline & Work Eligibility
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.text(resume.targetRole, margin, y);
  
  if (resume.personalInfo.workEligibility) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const eligibilityText = `[ ${resume.personalInfo.workEligibility} ]`;
    doc.text(eligibilityText, pageWidth - margin, y, { align: 'right' });
  }
  y += 5;

  // Contact Line: Phone | Email | Location | Eircode | LinkedIn
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const contactParts = [
    resume.personalInfo.phone,
    resume.personalInfo.email,
    resume.personalInfo.location,
    resume.personalInfo.eircode ? `Eircode: ${resume.personalInfo.eircode}` : '',
    resume.personalInfo.linkedin ? 'LinkedIn' : ''
  ].filter(Boolean);
  doc.text(contactParts.join('  •  '), margin, y);
  y += 4;

  // Divider line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Helper for section headers
  const addSectionHeader = (title: string) => {
    if (y > 265) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.5;
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 25, y);
    y += 4.5;
  };

  // Professional Summary
  if (resume.professionalSummary) {
    addSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(resume.professionalSummary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.2 + 4;
  }

  // Core Skills
  if (resume.skills) {
    addSectionHeader('Core Competencies & Skills');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    if (resume.skills.technical?.length) {
      doc.text('Technical:', margin, y);
      doc.setFont('helvetica', 'normal');
      const techText = doc.splitTextToSize(resume.skills.technical.join(', '), contentWidth - 22);
      doc.text(techText, margin + 22, y);
      y += techText.length * 4 + 1.5;
    }

    if (resume.skills.domain?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Domain:', margin, y);
      doc.setFont('helvetica', 'normal');
      const domainText = doc.splitTextToSize(resume.skills.domain.join(', '), contentWidth - 22);
      doc.text(domainText, margin + 22, y);
      y += domainText.length * 4 + 1.5;
    }

    if (resume.skills.tools?.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Tools & Cloud:', margin, y);
      doc.setFont('helvetica', 'normal');
      const toolsText = doc.splitTextToSize(resume.skills.tools.join(', '), contentWidth - 22);
      doc.text(toolsText, margin + 22, y);
      y += toolsText.length * 4 + 3.5;
    }
  }

  // Professional Experience
  if (resume.workExperiences?.length) {
    addSectionHeader('Professional Experience');
    
    resume.workExperiences.forEach(exp => {
      if (y > 255) {
        doc.addPage();
        y = 18;
      }

      // Role and Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.role}  —  ${exp.company}`, margin, y);

      // Date and Location
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const dateLoc = `${exp.startDate} - ${exp.endDate || 'Present'} | ${exp.location}`;
      doc.text(dateLoc, pageWidth - margin, y, { align: 'right' });
      y += 4.5;

      // Bullets
      exp.highlights?.forEach(hl => {
        if (y > 270) {
          doc.addPage();
          y = 18;
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text('•', margin + 2, y);
        const bulletLines = doc.splitTextToSize(hl, contentWidth - 8);
        doc.text(bulletLines, margin + 6, y);
        y += bulletLines.length * 3.8 + 1.2;
      });
      y += 2.5;
    });
  }

  // Education
  if (resume.education?.length) {
    addSectionHeader('Education & Qualifications (NFQ Framework)');
    resume.education.forEach(edu => {
      if (y > 265) {
        doc.addPage();
        y = 18;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const degreeTitle = edu.nfqLevel ? `${edu.degree} [${edu.nfqLevel}]` : edu.degree;
      doc.text(degreeTitle, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${edu.institution} | ${edu.year}`, pageWidth - margin, y, { align: 'right' });
      y += 4;

      if (edu.gradeOrHonours) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`Grade / Honours: ${edu.gradeOrHonours}`, margin + 3, y);
        y += 3.8;
      }
    });
    y += 2;
  }

  // Certifications
  if (resume.certifications?.length) {
    addSectionHeader('Professional Certifications');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const certLines = doc.splitTextToSize(resume.certifications.join('  •  '), contentWidth);
    doc.text(certLines, margin, y);
    y += certLines.length * 4 + 2;
  }

  // Save the PDF
  const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Irish_CV.pdf`;
  doc.save(filename);
}

export function exportCoverLetterToPDF(letter: TailoredCoverLetter, candidateName: string, phone: string, email: string, location: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 22;

  // Candidate Contact Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${location}  •  ${phone}  •  ${email}`, margin, y);
  y += 5;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Date
  doc.text(new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }), margin, y);
  y += 6;

  // Recipient info
  doc.setFont('helvetica', 'bold');
  doc.text(letter.hiringManager || 'Hiring Manager & Talent Acquisition Team', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text(letter.targetCompany, margin, y);
  y += 4.5;
  doc.text(letter.companyAddressOrLocation || 'Dublin, Ireland', margin, y);
  y += 8;

  // Salutation
  doc.setFont('helvetica', 'bold');
  doc.text(`Dear ${letter.hiringManager || 'Hiring Team'},`, margin, y);
  y += 6;

  // Body paragraphs
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const paragraphs = [
    letter.openingParagraph,
    ...(letter.bodyParagraphs || []),
    letter.workAuthorizationStatement,
    letter.closingParagraph
  ].filter(Boolean);

  paragraphs.forEach(p => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(p, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 4.6 + 4;
  });

  // Sign off
  y += 2;
  doc.text(letter.signOff || 'Kind regards,', margin, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(candidateName, margin, y);

  const filename = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter_${letter.targetCompany.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
