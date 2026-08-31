import { IrishSalaryBenchmark, UserCredential, ExternalJobListing, IrishRecruitmentAgency } from '../types';

export const IRISH_JOB_PORTALS = [
  {
    id: 'google-jobs',
    name: 'Google Search Engine Jobs',
    badge: 'Live Google Index',
    color: 'border-amber-300 bg-amber-50/80 text-amber-900',
    description: 'Directly queries Google aggregated job search index across all Irish career sites and boards.',
    searchUrlTemplate: (query: string, loc = 'Ireland') => 
      `https://www.google.com/search?q=${encodeURIComponent(`${query} jobs ${loc}`)}&ibp=htl;jobs`,
    homeUrl: 'https://www.google.com/search?q=jobs+in+ireland&ibp=htl;jobs'
  },
  {
    id: 'linkedin-ireland',
    name: 'LinkedIn Ireland',
    badge: 'MNC & Tech Focus',
    color: 'border-blue-300 bg-blue-50/80 text-blue-900',
    description: 'Top portal for Dublin Silicon Docks, IFSC banking, multinationals & direct recruiter outreach.',
    searchUrlTemplate: (query: string, loc = 'Ireland') => 
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(loc)}&f_TPR=r604800`,
    homeUrl: 'https://www.linkedin.com/jobs/'
  },
  {
    id: 'indeed-ireland',
    name: 'Indeed Ireland (ie.indeed.com)',
    badge: 'Highest Volume',
    color: 'border-indigo-300 bg-indigo-50/80 text-indigo-900',
    description: 'Ireland’s most comprehensive job aggregator covering all 26 counties with direct apply links.',
    searchUrlTemplate: (query: string, loc = 'Ireland') => 
      `https://ie.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(loc)}&sort=date`,
    homeUrl: 'https://ie.indeed.com'
  },
  {
    id: 'irishjobs',
    name: 'IrishJobs.ie',
    badge: 'Irish Native No. 1',
    color: 'border-emerald-300 bg-emerald-50/80 text-emerald-900',
    description: 'Dedicated Irish career board partner for leading Irish enterprises, banks & agencies.',
    searchUrlTemplate: (query: string, loc = 'Ireland') => 
      `https://www.irishjobs.ie/jobs/${encodeURIComponent(query).replace(/%20/g, '-')}/in-${encodeURIComponent(loc.toLowerCase())}`,
    homeUrl: 'https://www.irishjobs.ie'
  },
  {
    id: 'jobs-ie',
    name: 'Jobs.ie',
    badge: 'SME & Corporate',
    color: 'border-teal-300 bg-teal-50/80 text-teal-900',
    description: 'Major Irish recruitment portal with verified listings in Dublin, Cork, Galway, Limerick & regional hubs.',
    searchUrlTemplate: (query: string, loc = 'Ireland') => 
      `https://www.jobs.ie/jobs?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(loc)}`,
    homeUrl: 'https://www.jobs.ie'
  },
  {
    id: 'publicjobs',
    name: 'PublicJobs.ie',
    badge: 'Irish Public Sector',
    color: 'border-slate-300 bg-slate-100 text-slate-900',
    description: 'Official recruiter for Irish Civil Service, HSE healthcare, local councils & state bodies.',
    searchUrlTemplate: (query: string) => 
      `https://www.publicjobs.ie/en/job-search?keyword=${encodeURIComponent(query)}`,
    homeUrl: 'https://www.publicjobs.ie/en/'
  }
];

export const IRISH_RECRUITMENT_AGENCIES: IrishRecruitmentAgency[] = [
  {
    id: 'cpl-ireland',
    name: 'Cpl Jobs Ireland',
    specialism: 'Tech, Finance & IFSC, Multilingual & Life Sciences',
    locations: ['Dublin', 'Cork', 'Galway', 'Limerick'],
    websiteUrl: 'https://www.cpl.com',
    jobsUrl: 'https://www.cpl.com/jobs?q=',
    logoText: 'CPL',
    keySectors: ['Fund Accounting', 'Software Eng', 'Data Analytics', 'Pharma QA'],
    recruiterTip: 'One of Ireland’s largest talent partners with exclusive contract and permanent roles for IFSC & Big Tech.'
  },
  {
    id: 'morgan-mckinley',
    name: 'Morgan McKinley Ireland',
    specialism: 'Accounting, Banking & Financial Services, IT & BioPharma',
    locations: ['Dublin (IFSC)', 'Cork', 'Waterford', 'Limerick'],
    websiteUrl: 'https://www.morganmckinley.com/ie',
    jobsUrl: 'https://www.morganmckinley.com/ie/jobs',
    logoText: 'MMK',
    keySectors: ['Senior Finance', 'FP&A', 'Risk & Compliance', 'Cloud DevOps'],
    recruiterTip: 'Publishes Ireland’s definitive annual Salary Guide; key recruiter for asset managers & fund administrators.'
  },
  {
    id: 'hays-ireland',
    name: 'Hays Ireland',
    specialism: 'Accountancy & Finance, IT, Construction, HR',
    locations: ['Dublin (Grand Canal)', 'Cork', 'Limerick', 'Galway'],
    websiteUrl: 'https://www.hays.ie',
    jobsUrl: 'https://www.hays.ie/job-search',
    logoText: 'HAYS',
    keySectors: ['Financial Reporting', 'Corporate Tax', 'Cybersecurity', 'Project Management'],
    recruiterTip: 'Excellent recruiter coverage for both private sector MNCs and Irish statutory & semi-state bodies.'
  },
  {
    id: 'sigmar-recruitment',
    name: 'Sigmar Recruitment',
    specialism: 'FinTech, IT, Supply Chain & Pharma',
    locations: ['Dublin 2', 'Cork City', 'Galway', 'Athlone'],
    websiteUrl: 'https://www.sigmarrecruitment.com',
    jobsUrl: 'https://www.sigmarrecruitment.com/jobs',
    logoText: 'SIGMAR',
    keySectors: ['Fund Administration', 'AML / KYC', 'Full Stack React/Node', 'Process Eng'],
    recruiterTip: 'Strong connections across Irish university graduates (Stamp 1G) and experienced hire placement in Dublin.'
  },
  {
    id: 'mason-alexander',
    name: 'Mason Alexander',
    specialism: 'Fintech, Tech Scaleups, Life Sciences & Executive',
    locations: ['Dublin (Merrion Square)', 'Remote Ireland'],
    websiteUrl: 'https://www.masonalexander.ie',
    jobsUrl: 'https://www.masonalexander.ie/jobs',
    logoText: 'MA',
    keySectors: ['Product Management', 'Quantitative Finance', 'AI / ML', 'Executive Leadership'],
    recruiterTip: 'Boutique agency specializing in high-growth Irish tech startups, European venture firms, and Dublin Silicon Docks.'
  },
  {
    id: 'brightwater',
    name: 'Brightwater Recruitment',
    specialism: 'Accountancy, Corporate Governance, Legal & HR',
    locations: ['Dublin 2 (Baggot St)', 'Cork', 'Belfast'],
    websiteUrl: 'https://www.brightwater.ie',
    jobsUrl: 'https://www.brightwater.ie/jobs',
    logoText: 'BW',
    keySectors: ['Treasury', 'Management Accounting', 'Legal Counsel', 'Internal Audit'],
    recruiterTip: 'Premier placement partner for Chartered Accountants (ACA, ACCA, CIMA) and corporate finance executives in Ireland.'
  }
];


export const INITIAL_USER_CREDENTIALS: UserCredential[] = [
  {
    id: 'IND-101',
    name: 'Nivel Monteiro',
    email: 'nivelmonteiro@outlook.com',
    headline: 'Financial Analyst & Fund Accountant | NAV Accounting, FP&A, KYC & Audit (MBA)',
    location: 'Dublin',
    visaStatus: 'Stamp 1G',
    phone: '+353 89 984 7924',
    eircode: 'D02 X285',
    linkedinUrl: 'https://linkedin.com/in/nivelmonteiro'
  },
  {
    id: 'IND-102',
    name: 'Aoife Murphy',
    email: 'aoife.murphy.irl@eirecareers.ie',
    headline: 'Senior Full Stack Developer (React / Node / AWS)',
    location: 'Dublin',
    visaStatus: 'EU/EEA Citizen',
    phone: '+353 87 123 4567',
    eircode: 'D02 X285',
    linkedinUrl: 'https://linkedin.com/in/aoifemurphy-dev',
    githubUrl: 'https://github.com/aoifemurphy'
  },
  {
    id: 'IND-103',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@eirecareers.ie',
    headline: 'Data Scientist & ML Engineer (UCD Graduate)',
    location: 'Dublin',
    visaStatus: 'Stamp 1G',
    phone: '+353 89 987 6543',
    eircode: 'D04 T294',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma-ds',
    githubUrl: 'https://github.com/rahulsharma-ai'
  },
  {
    id: 'IND-104',
    name: 'Ciaran O\'Connor',
    email: 'ciaran.oconnor@eirecareers.ie',
    headline: 'Product Manager & Scrum Master (Fintech / Asset Management)',
    location: 'Cork',
    visaStatus: 'Stamp 4',
    phone: '+353 85 456 7890',
    eircode: 'T12 A345',
    linkedinUrl: 'https://linkedin.com/in/ciaranoconnor-pm'
  },
  {
    id: 'IND-105',
    name: 'Elena Rossi',
    email: 'elena.rossi@eirecareers.ie',
    headline: 'DevOps & Cloud Infrastructure Specialist',
    location: 'Galway',
    visaStatus: 'Stamp 4',
    phone: '+353 83 321 0987',
    eircode: 'H91 V890',
    linkedinUrl: 'https://linkedin.com/in/elenarossi-cloud',
    githubUrl: 'https://github.com/elenarossi'
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
    location: 'Dublin IFSC (Sir John Rogerson Quay)',
    isRemote: false,
    salary: '€55,000 - €72,000 + Pension & Bonus',
    tags: ['NAV Calculation', 'Fund Accounting', 'UCITS / AIFMD', 'Reconciliations', 'Excel'],
    description: 'State Street Ireland is seeking a Fund Accountant to calculate Net Asset Value (NAV) for complex mutual funds and alternative investment structures. Responsible for portfolio pricing, trial balance reconciliations, subscription/redemption oversight, and statutory audit support under Central Bank of Ireland regulations. Stamp 1G and Stamp 4 holders welcome.',
    url: 'https://statestreet.wd1.myworkdayjobs.com/Global/job/Dublin/Senior-Fund-Accountant_R-1029384',
    applyUrl: 'https://statestreet.wd1.myworkdayjobs.com/Global/job/Dublin/Senior-Fund-Accountant_R-1029384',
    postedDate: '1 day ago',
    category: 'Finance & IFSC',
    source: 'LinkedIn Ireland',
    sourceType: 'linkedin',
    visaFriendlyNote: 'Stamp 1G / Stamp 4 Eligible • Central Bank of Ireland Compliant'
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
    url: 'https://ie.indeed.com/viewjob?jk=fe8901238472910a',
    applyUrl: 'https://ie.indeed.com/viewjob?jk=fe8901238472910a',
    postedDate: 'Just now',
    category: 'Finance & IFSC',
    source: 'Indeed Ireland',
    sourceType: 'indeed',
    visaFriendlyNote: 'Hybrid Dublin • Stamp 1G / Stamp 4 Accepted'
  },
  {
    id: 'job-irl-agency-1',
    title: 'Senior Financial Analyst (MNC European HQ)',
    company: 'Morgan McKinley (on behalf of Global MedTech)',
    location: 'Cork (Little Island / Hybrid)',
    isRemote: true,
    salary: '€60,000 - €75,000 + 10% Bonus + Health',
    tags: ['FP&A', 'US GAAP', 'Cost Center Accounting', 'ERP SAP', 'Management Accounts'],
    description: 'Recruited exclusively via Morgan McKinley Cork. Lead European business unit budget cycles, statutory VAT/tax packs, commercial margin variance analysis, and standard cost reviews. Direct mentorship from EMEA Finance Director with clear succession track.',
    url: 'https://www.morganmckinley.com/ie/jobs/financial-analyst-cork',
    applyUrl: 'https://www.morganmckinley.com/ie/jobs/financial-analyst-cork',
    postedDate: '2 hours ago',
    category: 'Finance & IFSC',
    source: 'Morgan McKinley',
    sourceType: 'agency',
    agencyName: 'Morgan McKinley Ireland',
    visaFriendlyNote: 'Recruiter Direct Representation • Cork Hybrid'
  },
  {
    id: 'job-irl-agency-2',
    title: 'Private Equity & Real Estate Fund Accountant',
    company: 'Cpl Jobs Ireland (for Tier-1 Asset Manager)',
    location: 'Dublin 2 (Grand Canal / IFSC)',
    isRemote: true,
    salary: '€52,000 - €68,000 + Comprehensive Benefits',
    tags: ['Private Equity', 'Real Estate Funds', 'NAV Valuation', 'AIFMD', 'Audit Reconciliations'],
    description: 'Exclusive placement with Cpl Financial Services team. Managing bookkeeping, quarterly waterfall computations, capital call and distribution notices, and annual audit coordination for Irish regulated QIAIF investment vehicles.',
    url: 'https://www.cpl.com/jobs/fund-accountant-dublin',
    applyUrl: 'https://www.cpl.com/jobs/fund-accountant-dublin',
    postedDate: 'Today',
    category: 'Finance & IFSC',
    source: 'Cpl Recruitment',
    sourceType: 'agency',
    agencyName: 'Cpl Jobs Ireland',
    visaFriendlyNote: 'Stamp 1G Graduate Visa Holders Welcomed'
  },
  {
    id: 'job-irl-google-1',
    title: 'Full Stack Engineer (React, TypeScript & Node.js)',
    company: 'Workday Ireland',
    location: 'Dublin 7 (Smithfield / Hybrid)',
    isRemote: true,
    salary: '€75,000 - €95,000 + Stock (RSUs) + Healthcare',
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Microservices'],
    description: 'Workday’s European Technology HQ in Dublin is hiring a Full Stack Engineer to architect high-scale enterprise cloud UI and backend microservices. Collaborate with global engineering squads to build modern user experiences powering Fortune 500 organizations.',
    url: 'https://www.google.com/search?q=workday+full+stack+engineer+dublin+jobs&ibp=htl;jobs',
    applyUrl: 'https://workday.wd5.myworkdayjobs.com/en-US/Workday/job/Dublin-Ireland/Full-Stack-Software-Development-Engineer_JR-89210',
    postedDate: '1 day ago',
    category: 'Engineering',
    source: 'Google Search Engine',
    sourceType: 'google-search',
    visaFriendlyNote: 'High Growth Dublin HQ • Critical Skills Permit Support'
  },
  {
    id: 'job-irl-fa-3',
    title: 'Fund Accounting Specialist (Hedge & Alternative Funds)',
    company: 'BNY Mellon Ireland',
    location: 'Dublin IFSC / Hybrid',
    isRemote: true,
    salary: '€52,000 - €68,000 + Benefits',
    tags: ['NAV Accounting', 'Asset Reconciliation', 'Bloomberg', 'IFRS / US GAAP', 'Audit Prep'],
    description: 'Responsible for end-to-end fund accounting cycles, custody reconciliations, cash management, fee calculations, and financial statement preparation for international institutional fund managers. Work with external auditors and regulatory reporting teams.',
    url: 'https://www.irishjobs.ie/job/fund-accountant/bny-mellon-job10294819',
    applyUrl: 'https://www.irishjobs.ie/job/fund-accountant/bny-mellon-job10294819',
    postedDate: '2 days ago',
    category: 'Finance & IFSC',
    source: 'IrishJobs.ie',
    sourceType: 'irishjobs',
    visaFriendlyNote: 'IFSC Dublin • Stamp 1G / Stamp 4 Eligible'
  },
  {
    id: 'job-irl-fa-4',
    title: 'Financial Crime & Regulatory AML Compliance Analyst',
    company: 'Citi / Northern Trust Ireland',
    location: 'Dublin 1 (IFSC / North Wall Quay)',
    isRemote: false,
    salary: '€50,000 - €66,000 + Corporate Benefits',
    tags: ['KYC / AML', 'Sanctions Screening', 'CBI Regulations', 'Due Diligence', 'Risk Profiling'],
    description: 'Perform enhanced due diligence (EDD), sanctions and PEP screening, transaction monitoring, and regulatory compliance reporting for institutional banking and investment fund clients in Ireland.',
    url: 'https://jobs.citi.com/job/dublin/aml-compliance-analyst/287/6829104',
    applyUrl: 'https://jobs.citi.com/job/dublin/aml-compliance-analyst/287/6829104',
    postedDate: '3 days ago',
    category: 'Finance & IFSC',
    source: 'LinkedIn Ireland',
    sourceType: 'linkedin',
    visaFriendlyNote: 'CBI Regulatory Framework • Stamp 4 / Stamp 1G'
  },
  {
    id: 'job-irl-agency-3',
    title: 'Senior DevOps & Platform Engineer (AWS & Kubernetes)',
    company: 'Sigmar Recruitment (for US Fintech Hub)',
    location: 'Galway / Remote Ireland',
    isRemote: true,
    salary: '€85,000 - €110,000 + Bonus + Equity',
    tags: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD Pipelines', 'Prometheus', 'Docker'],
    description: 'Sigmar Technology is retained by a premier Silicon Valley fintech scaling their European development hub in Ireland. Architect multi-region cloud infrastructure, infrastructure-as-code automation, and container security.',
    url: 'https://www.sigmarrecruitment.com/job/devops-engineer-galway-remote',
    applyUrl: 'https://www.sigmarrecruitment.com/job/devops-engineer-galway-remote',
    postedDate: '3 hours ago',
    category: 'DevOps',
    source: 'Sigmar Recruitment',
    sourceType: 'agency',
    agencyName: 'Sigmar Recruitment',
    visaFriendlyNote: '100% Remote Ireland • Stamp 4 / EU Citizen / Stamp 1G'
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
    url: 'https://www.jobs.ie/job/commercial-financial-analyst/smurfit-job982103',
    applyUrl: 'https://www.jobs.ie/job/commercial-financial-analyst/smurfit-job982103',
    postedDate: '4 days ago',
    category: 'Finance & IFSC',
    source: 'Jobs.ie',
    sourceType: 'irishjobs',
    visaFriendlyNote: 'Dublin South • Career Growth in Irish MNC'
  },
  {
    id: 'job-irl-agency-4',
    title: 'Senior QA / QC Validation Specialist (BioPharma GMP)',
    company: 'Hays Ireland (for Global BioPharma)',
    location: 'Limerick / Waterford (Raheen Hub)',
    isRemote: false,
    salary: '€65,000 - €85,000 + Shift/Site Allowance',
    tags: ['GMP Validation', 'HPRA Regulations', 'CAPA', 'Equipment Qualification', 'Biotech'],
    description: 'Hays Life Sciences is recruiting for a world-leading biopharmaceutical manufacturing facility in the Mid-West. Responsible for equipment qualification (IQ/OQ/PQ), sterile processing validation, deviations, and HPRA audit readiness.',
    url: 'https://www.hays.ie/job/qa-validation-specialist-limerick',
    applyUrl: 'https://www.hays.ie/job/qa-validation-specialist-limerick',
    postedDate: '1 day ago',
    category: 'Pharma & Biotech',
    source: 'Hays Ireland',
    sourceType: 'agency',
    agencyName: 'Hays Ireland',
    visaFriendlyNote: 'Critical Skills Eligible • High Demand Role'
  },
  {
    id: 'job-irl-public-1',
    title: 'Administrative Officer – Financial & Economic Policy',
    company: 'Department of Finance / Central Bank of Ireland',
    location: 'Dublin City Centre (IFSC & Upper Merrion St)',
    isRemote: false,
    salary: '€38,500 - €68,000 (Irish Civil Service Grade Scale)',
    tags: ['Public Policy', 'Economic Analysis', 'Irish Civil Service', 'Fiscal Governance', 'Research'],
    description: 'Key entry grade for graduates (NFQ Level 8 / Level 9) to shape national fiscal policy, taxation legislation, banking regulation, and EU financial framework positions in Ireland.',
    url: 'https://www.publicjobs.ie/en/job-search/administrative-officer-finance',
    applyUrl: 'https://www.publicjobs.ie/en/job-search/administrative-officer-finance',
    postedDate: 'Active Campaign',
    category: 'Finance & IFSC',
    source: 'PublicJobs.ie',
    sourceType: 'publicjobs',
    visaFriendlyNote: 'Irish Civil Service • EEA / Stamp 4 Eligibility'
  },
  {
    id: 'job-irl-agency-5',
    title: 'Lead AI / Data Scientist (GenAI & Predictive Modeling)',
    company: 'Mason Alexander (for Fintech Scaleup)',
    location: 'Dublin 2 (Merrion Square / Hybrid)',
    isRemote: true,
    salary: '€95,000 - €125,000 + Equity Options',
    tags: ['Python', 'LLMs / GenAI', 'PyTorch', 'Databricks', 'NLP', 'Credit Risk'],
    description: 'Mason Alexander exclusive mandate. Lead the machine learning engineering chapter building automated underwriting algorithms, LLM-based document extraction, and risk assessment engines for European corporate borrowers.',
    url: 'https://www.masonalexander.ie/jobs/lead-data-scientist-dublin',
    applyUrl: 'https://www.masonalexander.ie/jobs/lead-data-scientist-dublin',
    postedDate: '2 days ago',
    category: 'Data & AI',
    source: 'Mason Alexander',
    sourceType: 'agency',
    agencyName: 'Mason Alexander',
    visaFriendlyNote: 'High Growth Fintech • Stamp 1G / 4 / CSEP'
  }
];

