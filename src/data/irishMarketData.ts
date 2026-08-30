import { IrishSalaryBenchmark, UserCredential, ExternalJobListing } from '../types';

export const INITIAL_USER_CREDENTIALS: UserCredential[] = [
  {
    id: 'IRL-JOB-101',
    name: 'Nivel Monteiro',
    email: 'nivelmonteiro@outlook.com',
    headline: 'Financial Analyst & Fund Accountant | NAV Accounting, FP&A, KYC & Audit (MBA)',
    location: 'Dublin',
    visaStatus: 'Stamp 1G',
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
    location: 'Dublin',
    visaStatus: 'EU/EEA Citizen',
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
    headline: 'Data Scientist & ML Engineer (UCD Graduate)',
    location: 'Dublin',
    visaStatus: 'Stamp 1G',
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
    headline: 'Product Manager & Scrum Master (Fintech / Asset Management)',
    location: 'Cork',
    visaStatus: 'Stamp 4',
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
    visaStatus: 'Stamp 4',
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
    id: 'job-irl-fa-1',
    title: 'Senior Fund Accountant (NAV & Portfolio Valuation)',
    company: 'State Street International Ireland',
    location: 'Dublin IFSC (Quartermile / Sir John Rogerson Quay)',
    isRemote: false,
    salary: '€55,000 - €72,000 + Pension & Bonus',
    tags: ['NAV Calculation', 'Fund Accounting', 'UCITS / AIFMD', 'Reconciliations', 'Excel'],
    description: 'State Street Ireland is seeking a Fund Accountant to calculate Net Asset Value (NAV) for complex mutual funds and alternative investment structures. Responsible for portfolio pricing, trial balance reconciliations, subscription/redemption oversight, and statutory audit support under Central Bank of Ireland regulations. Stamp 1G and Stamp 4 holders welcome.',
    url: 'https://statestreet.com/careers',
    postedDate: '1 day ago',
    category: 'Finance & IFSC'
  },
  {
    id: 'job-irl-fa-2',
    title: 'Financial Analyst (FP&A & Corporate Strategy)',
    company: 'Bank of Ireland / Stripe Ireland',
    location: 'Dublin (Grand Canal Dock / Hybrid)',
    isRemote: true,
    salary: '€58,000 - €75,000 + Performance Bonus',
    tags: ['Financial Modeling', 'Budget Variance', 'Power BI', 'DCF / Cash Flow', 'SAP'],
    description: 'Lead financial forecasting, monthly budget variance analyses, and cash flow modeling for Irish and European operations. Build automated KPI dashboards in Power BI and Advanced Excel (Macros, XLOOKUP), partner with senior business unit leaders, and lead financial performance reviews.',
    url: 'https://bankofireland.com/careers',
    postedDate: 'Just now',
    category: 'Finance & IFSC'
  },
  {
    id: 'job-irl-fa-3',
    title: 'Fund Accounting Specialist (Hedge & Private Equity Funds)',
    company: 'BNY Mellon Ireland',
    location: 'Dublin IFSC / Hybrid',
    isRemote: true,
    salary: '€52,000 - €68,000 + Benefits',
    tags: ['NAV Accounting', 'Asset Reconciliation', 'Bloomberg', 'IFRS / US GAAP', 'Audit Prep'],
    description: 'Responsible for end-to-end fund accounting cycles, custody reconciliations, cash management, fee calculations, and financial statement preparation for international institutional fund managers. Work with external auditors and regulatory reporting teams.',
    url: 'https://bnymellon.com/careers',
    postedDate: '2 days ago',
    category: 'Finance & IFSC'
  },
  {
    id: 'job-irl-fa-4',
    title: 'Financial Crime & Regulatory Compliance Analyst',
    company: 'Northern Trust Ireland / Citi',
    location: 'Dublin 1 (IFSC / North Wall Quay)',
    isRemote: false,
    salary: '€50,000 - €66,000 + Corporate Benefits',
    tags: ['KYC / AML', 'Sanctions Screening', 'CBI Regulations', 'Due Diligence', 'Risk Profiling'],
    description: 'Perform enhanced due diligence (EDD), sanctions and PEP screening, transaction monitoring, and regulatory compliance reporting for institutional banking and investment fund clients in Ireland.',
    url: 'https://northerntrust.com/careers',
    postedDate: '3 days ago',
    category: 'Finance & IFSC'
  },
  {
    id: 'job-irl-fa-5',
    title: 'Corporate Financial Analyst (Commercial FP&A)',
    company: 'Smurfit Westrock / Kerry Group Ireland',
    location: 'Dublin (Clonskeagh / South Dublin)',
    isRemote: false,
    salary: '€54,000 - €70,000 + Bonus',
    tags: ['FP&A', 'Working Capital', 'Cost Optimization', 'Power BI', 'SAP FICO'],
    description: 'Drive operational finance, product line profitability modeling, working capital forecasting, and commercial margin reviews across multinational manufacturing and distribution operations.',
    url: 'https://smurfitwestrock.com/careers',
    postedDate: '4 days ago',
    category: 'Finance & IFSC'
  },
  {
    id: 'job-irl-fa-6',
    title: 'Senior Fund Accountant (Real Estate & Alternative Assets)',
    company: 'Apex Group Ireland / Aztec Group',
    location: 'Dublin (East Point Business Park) / Hybrid',
    isRemote: true,
    salary: '€56,000 - €74,000 + Health',
    tags: ['Alternative Funds', 'NAV Calculation', 'General Ledger', 'Tax Schedules', 'Audit'],
    description: 'Manage day-to-day accounting and NAV finalization for multi-jurisdictional Real Estate and Private Debt funds. Coordinate year-end audits and prepare statutory filings under Irish and European regulatory frameworks.',
    url: 'https://apexgroup.com/careers',
    postedDate: '1 day ago',
    category: 'Finance & IFSC'
  }
];
