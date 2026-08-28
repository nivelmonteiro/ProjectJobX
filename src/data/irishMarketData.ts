import { IrishSalaryBenchmark, UserCredential, ExternalJobListing } from '../types';

export const INITIAL_USER_CREDENTIALS: UserCredential[] = [
  {
    id: 'IRL-JOB-101',
    name: 'Nivel Monteiro',
    email: 'nivelmonteiro@outlook.com',
    headline: 'Strategic Finance & Accounting Analyst | Financial Crime, KYC & Audit (MBA)',
    location: 'Dublin (Silicon Docks / City)',
    visaStatus: 'Stamp 1G (Third Level Graduate)',
    phone: '+353 89 984 7924',
    eircode: 'D02 X285',
    linkedinUrl: 'https://linkedin.com/in/nivelmonteiro',
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    maxDailyQuota: 4
  },
  {
    id: 'IRL-JOB-102',
    name: 'Aoife Murphy',
    email: 'aoife.murphy.irl@eirecareers.ie',
    headline: 'Senior Full Stack Developer (React / Node / AWS)',
    location: 'Dublin (Silicon Docks / City)',
    visaStatus: 'EU/EEA/Irish Citizen',
    phone: '+353 87 123 4567',
    eircode: 'D02 X285',
    linkedinUrl: 'https://linkedin.com/in/aoifemurphy-dev',
    githubUrl: 'https://github.com/aoifemurphy',
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    maxDailyQuota: 4
  },
  {
    id: 'IRL-JOB-103',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@eirecareers.ie',
    headline: 'Data Scientist & ML Engineer (NFQ Level 9 UCD Graduate)',
    location: 'Dublin (County / Suburbs)',
    visaStatus: 'Stamp 1G (Third Level Graduate)',
    phone: '+353 89 987 6543',
    eircode: 'D04 T294',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma-ds',
    githubUrl: 'https://github.com/rahulsharma-ai',
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    maxDailyQuota: 4
  },
  {
    id: 'IRL-JOB-104',
    name: 'Ciaran O\'Connor',
    email: 'ciaran.oconnor@eirecareers.ie',
    headline: 'Product Manager & Scrum Master (Fintech / IFSC)',
    location: 'Cork',
    visaStatus: 'Stamp 4 (Full Work Rights)',
    phone: '+353 85 456 7890',
    eircode: 'T12 A345',
    linkedinUrl: 'https://linkedin.com/in/ciaranoconnor-pm',
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    maxDailyQuota: 4
  },
  {
    id: 'IRL-JOB-105',
    name: 'Elena Rossi',
    email: 'elena.rossi@eirecareers.ie',
    headline: 'DevOps & Cloud Infrastructure Specialist',
    location: 'Galway',
    visaStatus: 'Critical Skills (CSEP Eligible)',
    phone: '+353 83 321 0987',
    eircode: 'H91 V890',
    linkedinUrl: 'https://linkedin.com/in/elenarossi-cloud',
    githubUrl: 'https://github.com/elenarossi',
    dailyUsageCount: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    maxDailyQuota: 4
  }
];

export const IRISH_SALARY_BENCHMARKS: IrishSalaryBenchmark[] = [
  {
    sector: 'Software & Cloud Engineering',
    roles: [
      {
        title: 'Full Stack / Frontend / Backend Engineer',
        junior: '€42,000 - €55,000',
        mid: '€60,000 - €80,000',
        senior: '€85,000 - €115,000',
        lead: '€120,000 - €155,000+',
        popularHubs: ['Dublin Silicon Docks', 'Cork City', 'Galway Tech Hub', 'Remote Ireland'],
        inDemandSkills: ['React', 'TypeScript', 'Node.js', 'AWS / Azure', 'Docker', 'PostgreSQL', 'Microservices']
      },
      {
        title: 'Cloud DevOps / Platform / SRE',
        junior: '€45,000 - €58,000',
        mid: '€65,000 - €85,000',
        senior: '€90,000 - €125,000',
        lead: '€130,000 - €160,000',
        popularHubs: ['Dublin City', 'Cork', 'Limerick', 'Remote'],
        inDemandSkills: ['Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'GCP / AWS', 'Monitoring & Observability']
      },
      {
        title: 'Data Engineer / Scientist / AI Engineer',
        junior: '€45,000 - €56,000',
        mid: '€65,000 - €82,000',
        senior: '€88,000 - €120,000',
        lead: '€125,000 - €150,000',
        popularHubs: ['Dublin', 'Galway', 'Cork'],
        inDemandSkills: ['Python', 'SQL', 'PyTorch / TensorFlow', 'Snowflake', 'dbt', 'Databricks', 'LLMs / GenAI']
      },
      {
        title: 'QA / Automation Engineer',
        junior: '€38,000 - €48,000',
        mid: '€52,000 - €70,000',
        senior: '€75,000 - €95,000',
        lead: '€100,000 - €120,000',
        popularHubs: ['Dublin', 'Limerick', 'Shannon'],
        inDemandSkills: ['Playwright', 'Cypress', 'Selenium', 'CI/CD', 'API Testing', 'Java / TypeScript']
      }
    ]
  },
  {
    sector: 'Product, Design & Agile Management',
    roles: [
      {
        title: 'Product Manager / Technical PM',
        junior: '€45,000 - €58,000',
        mid: '€65,000 - €85,000',
        senior: '€90,000 - €120,000',
        lead: '€125,000 - €160,000',
        popularHubs: ['Dublin (Grand Canal Dock)', 'Cork', 'Remote'],
        inDemandSkills: ['Roadmapping', 'Agile/Scrum', 'Data Analytics', 'User Research', 'A/B Testing', 'Stakeholder Mgmt']
      },
      {
        title: 'UI/UX Product Designer',
        junior: '€38,000 - €50,000',
        mid: '€55,000 - €75,000',
        senior: '€80,000 - €105,000',
        lead: '€110,000 - €135,000',
        popularHubs: ['Dublin', 'Galway', 'Remote'],
        inDemandSkills: ['Figma', 'Design Systems', 'Usability Testing', 'Interaction Design', 'Prototyping', 'Accessibility (WCAG)']
      },
      {
        title: 'Scrum Master / Agile Delivery Lead',
        junior: '€45,000 - €55,000',
        mid: '€60,000 - €78,000',
        senior: '€80,000 - €105,000',
        lead: '€110,000 - €130,000',
        popularHubs: ['Dublin IFSC', 'Cork'],
        inDemandSkills: ['PSM / CSM', 'Jira', 'Kanban', 'Sprint Ceremonies', 'Impediment Removal']
      }
    ]
  },
  {
    sector: 'Life Sciences, Pharma & Medical Devices',
    roles: [
      {
        title: 'QA / QC Specialist (GMP)',
        junior: '€38,000 - €46,000',
        mid: '€50,000 - €65,000',
        senior: '€70,000 - €90,000',
        lead: '€95,000 - €120,000',
        popularHubs: ['Cork (Ringaskiddy/Little Island)', 'Dublin', 'Galway (Medtech Hub)', 'Waterford'],
        inDemandSkills: ['GMP', 'FDA/HPRA regulations', 'CAPA', 'Validation', 'Analytical Testing']
      },
      {
        title: 'Process / Validation Engineer',
        junior: '€42,000 - €52,000',
        mid: '€58,000 - €75,000',
        senior: '€80,000 - €105,000',
        lead: '€110,000 - €135,000',
        popularHubs: ['Cork', 'Galway', 'Limerick', 'Athlone'],
        inDemandSkills: ['IQ/OQ/PQ', 'Biopharma manufacturing', 'Six Sigma', 'AutoCAD', 'Lean Manufacturing']
      }
    ]
  },
  {
    sector: 'Finance, FinTech & Accounting (IFSC)',
    roles: [
      {
        title: 'Financial Analyst / Fund Accountant',
        junior: '€35,000 - €45,000',
        mid: '€50,000 - €68,000',
        senior: '€72,000 - €95,000',
        lead: '€100,000 - €130,000',
        popularHubs: ['Dublin IFSC & Docklands', 'Limerick', 'Kilkenny'],
        inDemandSkills: ['NAV Calculation', 'Excel Modelling', 'IFRS / US GAAP', 'Bloomberg', 'ACCA / CIMA / ACA']
      },
      {
        title: 'Risk & AML / Compliance Officer',
        junior: '€36,000 - €48,000',
        mid: '€52,000 - €72,000',
        senior: '€78,000 - €105,000',
        lead: '€110,000 - €140,000',
        popularHubs: ['Dublin City Centre', 'Cork'],
        inDemandSkills: ['Central Bank of Ireland (CBI) regulations', 'KYC/AML', 'GDPR', 'Fraud Detection']
      }
    ]
  }
];

export const IRISH_CV_GUIDELINES = [
  {
    title: 'Length: Strictly 2 Pages Max',
    description: 'In Ireland, standard professional CVs must be 2 pages max (1 page for fresh graduates). Avoid 3+ pages.',
    tip: 'Irish recruiters review CVs in 6-8 seconds. Prioritize recent 5-8 years of experience.'
  },
  {
    title: 'No Headshot / Photo',
    description: 'Unlike some continental European countries, standard Irish CVs do NOT include photos to comply with equality & GDPR norms.',
    tip: 'Leave out photos, age, marital status, or nationality. Focus purely on skills & achievements.'
  },
  {
    title: 'Contact Details: Phone (+353) & Eircode',
    description: 'Include an Irish phone format (e.g., +353 87 123 4567) or local mobile, county/city (e.g. Dublin 2, Cork), and Eircode routing.',
    tip: 'Add active LinkedIn URL and GitHub/Portfolio link right below your name.'
  },
  {
    title: 'Clear Work Authorization / Stamp Status',
    description: 'Explicitly state your right to work (e.g., "Eligible to work full-time in Ireland - Stamp 4" or "Stamp 1G Graduate Visa valid to Oct 2027" or "EU Citizen").',
    tip: 'Placing this in your header avoids automated filter drops by Irish recruiters.'
  },
  {
    title: 'NFQ Level Education Equivalency',
    description: 'Frame degrees with Irish National Framework of Qualifications (NFQ) levels (e.g., NFQ Level 8 Honours Bachelor, NFQ Level 9 Masters, or 1:1 / 2:1 Honours).',
    tip: 'Irish hiring managers understand NFQ Level 8 / 9 immediately.'
  },
  {
    title: 'Quantifiable STAR Bullet Points',
    description: 'Every bullet point should follow Action Verb + Task + Quantifiable Result (e.g., "Architected Redis cache layer cutting Irish customer checkout latency by 38%").',
    tip: 'Irish tech & MNC employers love measurable metrics (%, €, hours saved).'
  }
];

export const INITIAL_EXTERNAL_JOBS: ExternalJobListing[] = [
  {
    id: 'job-irl-1',
    title: 'Senior Full Stack Engineer (React / Node / AWS)',
    company: 'Stripe Ireland',
    location: 'Dublin (Grand Canal Dock) / Hybrid',
    isRemote: false,
    salary: '€95,000 - €120,000 + Equity',
    tags: ['React', 'TypeScript', 'Node.js', 'AWS', 'Payments'],
    description: 'Join our Dublin engineering hub building high-throughput payment infrastructure for European merchants. Looking for strong background in distributed systems, modern React frontend architecture, and resilient API design.',
    url: 'https://stripe.com/jobs',
    postedDate: '2 days ago',
    category: 'Engineering'
  },
  {
    id: 'job-irl-2',
    title: 'Data Scientist & Machine Learning Lead',
    company: 'Accenture The Dock',
    location: 'Dublin (Silicon Docks)',
    isRemote: true,
    salary: '€85,000 - €110,000',
    tags: ['Python', 'PyTorch', 'GenAI', 'LLMs', 'Azure'],
    description: 'Accenture global R&D innovation center in Dublin is seeking an experienced Data Scientist to deploy generative AI prototypes and enterprise recommendation systems. Stamp 4 / Stamp 1G / CSEP sponsorship available.',
    url: 'https://accenture.com/careers',
    postedDate: '1 day ago',
    category: 'Data & AI'
  },
  {
    id: 'job-irl-3',
    title: 'Cloud DevOps & SRE Engineer',
    company: 'Workday Ireland',
    location: 'Dublin / Galway Hybrid',
    isRemote: true,
    salary: '€80,000 - €105,000',
    tags: ['Kubernetes', 'Terraform', 'Linux', 'AWS', 'CI/CD'],
    description: 'Workday is expanding our cloud reliability team across Ireland. Manage Kubernetes clusters, zero-downtime deployment pipelines, and high availability systems serving millions of enterprise users.',
    url: 'https://workday.com/careers',
    postedDate: '3 days ago',
    category: 'DevOps'
  },
  {
    id: 'job-irl-4',
    title: 'Senior QA Validation Engineer (Biopharma)',
    company: 'Pfizer Ringaskiddy',
    location: 'Cork, Ireland',
    isRemote: false,
    salary: '€68,000 - €85,000 + Bonus',
    tags: ['GMP', 'Validation', 'HPRA/FDA', 'Pharma', 'CAPA'],
    description: 'Support state-of-the-art sterile manufacturing facility in Cork. Responsible for equipment validation (IQ/OQ/PQ), data integrity audits, and regulatory compliance with HPRA & FDA standards.',
    url: 'https://pfizer.com/careers',
    postedDate: '4 days ago',
    category: 'Pharma & Biotech'
  },
  {
    id: 'job-irl-5',
    title: 'Fintech Product Manager',
    company: 'Revolut Ireland',
    location: 'Dublin / Remote Ireland',
    isRemote: true,
    salary: '€85,000 - €115,000 + Stock',
    tags: ['Product Management', 'Fintech', 'CBI Regulation', 'Agile', 'Mobile'],
    description: 'Lead consumer credit and savings products for the Irish & European market. Work closely with compliance, engineering, and UX research to deliver seamless banking experiences.',
    url: 'https://revolut.com/careers',
    postedDate: 'Just now',
    category: 'Product'
  },
  {
    id: 'job-irl-6',
    title: 'Frontend React / Next.js Developer',
    company: 'Toast Ireland',
    location: 'Dublin (Baggot Street)',
    isRemote: false,
    salary: '€65,000 - €85,000',
    tags: ['React', 'TypeScript', 'Tailwind', 'REST APIs', 'Micro-frontends'],
    description: 'Build fast, accessible web POS and restaurant management platforms. Excellent opportunity for mid-level engineers looking to step up in a high-growth tech environment in Dublin.',
    url: 'https://toasttab.com/careers',
    postedDate: '1 day ago',
    category: 'Engineering'
  }
];
