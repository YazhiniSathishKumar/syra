import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuditRequest {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  auditType: 'web' | 'network' | 'mobile' | 'cloud' | 'wireless';
  targetUrl: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  methodology: string;
  estimatedDuration: string;
  budget: string;
  preferredStartDate: string;
  additionalRequirements: string;
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in-progress' | 'testing' | 'reporting' | 'completed';
  submittedAt: string;
  assignedTester?: string;
  testerId?: string;
  userId: string;
  progress: number;
  testingPhase: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
  findings: Finding[];
  documents: Document[];
  timeline: TimelineEvent[];
  reportUrl?: string;
  completedAt?: string;
  testingPeriod?: string;
  reportDelivery?: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  description: string;
  fullDescription?: string;
  impact: string;
  recommendation: string;
  status: 'open' | 'fixed' | 'accepted' | 'false-positive';
  foundAt: string;
  score?: number;
  vectorString?: string;
  references?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'report' | 'certificate' | 'evidence' | 'summary';
  downloadUrl: string;
  status: 'processing' | 'ready';
}

export interface TimelineEvent {
  id: string;
  phase: string;
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  endDate?: string;
  description: string;
  details?: string;
}

interface WorkflowContextType {
  auditRequests: AuditRequest[];
  currentUser: {
    id: string;
    role: 'user' | 'admin' | 'tester';
    name: string;
    email: string;
  };
  submitAuditRequest: (request: Omit<AuditRequest, 'id' | 'submittedAt' | 'status' | 'progress' | 'testingPhase' | 'vulnerabilities' | 'findings' | 'documents' | 'timeline'>) => void;
  approveRequest: (requestId: string, testerId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  updateAuditStatus: (requestId: string, status: AuditRequest['status'], updates?: Partial<AuditRequest>) => void;
  addFinding: (requestId: string, finding: Omit<Finding, 'id' | 'foundAt'>) => void;
  updateProgress: (requestId: string, progress: number, phase: string) => void;
  uploadDocument: (requestId: string, document: Omit<Document, 'id' | 'uploadDate'>) => void;
  generateReport: (requestId: string) => void;
  requestReaudit: (originalRequestId: string, updates: Partial<AuditRequest>) => void;
  getUserRequests: (userId: string) => AuditRequest[];
  getTesterRequests: (testerId: string) => AuditRequest[];
  getPendingRequests: () => AuditRequest[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

/**
 * Default list of security findings for web application audits.
 * These findings represent common vulnerabilities identified during testing.
 */
const DEFAULT_WEB_FINDINGS: Finding[] = [
  /**
   * Finding 1: Outdated PHP Version
   * Risk: High - Use of unsupported software with known security vulnerabilities.
   */
  {
    id: 'finding-high-1',
    title: 'Missing Rate Limiting on Login Endpoint',
    severity: 'high',
    score: 8.8,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    description: `The login functionality at http://106.51.152.194:8082/ does not enforce rate limiting, allowing unlimited login attempts and exposing the system to brute-force attacks.`,
    fullDescription: `The login functionality at http://106.51.152.194:8082/ does not enforce rate limiting, allowing unlimited login attempts without any restriction. This exposes the application to automated brute-force attacks and credential stuffing campaigns, where attackers can test large volumes of username-password combinations without being throttled or blocked.`,
    impact: `● Account Takeover: Attackers can gain unauthorized access to valid user accounts.
● Data Breach: If accounts are compromised, sensitive user information may be exposed.
● Increased Attack Surface: Lack of throttling allows continuous automated login attempts.
● Reputation Damage: A compromised system can lead to trust loss from users.`,
    recommendation: `● Enforce rate limiting (e.g., maximum 3 failed login attempts per IP/account).
● Implement CAPTCHA or reCAPTCHA after several failed attempts.
● Return HTTP 429 Too Many Requests for excessive login failures.
● Introduce account lockout policies or temporary blocking.
● Monitor and log suspicious login behavior for threat detection.`,
    references: [
      'OWASP: Authentication Cheat Sheet',
      'OWASP: Blocking Brute Force Attacks'
    ],
    status: 'open',
    foundAt: '2025-10-15T10:00:00.000Z'
  },
  {
    id: 'finding-1',
    title: 'Improper Session Invalidation (Session Reuse After Cookie Export/Import)',
    severity: 'medium',
    score: 5.3,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
    description: `The application fails to properly invalidate sessions server-side on logout or cookie removal, allowing for session reuse and potential unauthorized access.`,
    fullDescription: `During testing we exported a session cookie (using a browser extension), deleted it, and then re-imported it. After importing the cookie we were still authenticated as the same user — the server accepted the same session identifier and did not invalidate it on logout or cookie removal. This indicates the server relies solely on the presence of the client cookie and does not properly destroy or revoke the associated server-side session on logout or other session termination events.`,
    impact: `● Session replay / reuse: An attacker who obtains a valid session cookie (via local access, a compromised client, XSS, or other theft) can reuse it to authenticate without re-entering credentials.
● Confidentiality (Low): Token disclosure reveals user identity and may enable access to non-public pages, but our assessment indicates the app does not expose highly sensitive data, so confidentiality impact is limited.
● Integrity (Low): The attacker can act as the user while the session is valid (possible unauthorized actions), but no escalation to administrative functions was demonstrated.
● Availability (None): No direct impact to availability observed.
Overall this is a session management weakness that increases the risk of unauthorized access if session tokens are stolen.`,
    recommendation: `Immediate and medium-term mitigations to fix/improve session handling:
1. Invalidate sessions server-side on logout: Remove or mark the session identifier as revoked in the server session store when a user logs out. Do not rely solely on client cookie deletion.
2. Support explicit session revocation: Provide server-side APIs to revoke tokens/sessions (useful for token rotation, logout everywhere).
3. Shorten session lifetimes: Implement reasonable idle (inactivity) and absolute timeouts for sessions.
4. Rotate session identifiers on privilege changes / login: Issue a new session ID after authentication or privilege elevation.
5. Use secure cookie attributes: HttpOnly, Secure, and appropriate SameSite settings to reduce theft risk.
6. Monitor and log anomalous session reuse: Detect reuse of the same session from unusual IPs/user-agents and force reauthentication if suspicious.
7. Avoid exposing tokens: Do not export, log, or place session identifiers in URLs or client-side storage accessible to JS unless absolutely necessary.
8. Perform a session invalidation test in CI/CD: Add automated tests to verify that logout permanently revokes the session on the server.`,
    references: [
      'OWASP Session Management Cheat Sheet',
      'OWASP Authentication Cheat Sheet'
    ],
    status: 'open',
    foundAt: '2025-10-15T10:00:00.000Z'
  },
  /**
   * Finding 2: Clickjacking Vulnerability (UI Redressing Attack)
   * Risk Score: 6.3 - Higher risk for authenticated users who may be tricked into clicking hidden UI elements.
   */
  {
    id: 'finding-info-1',
    title: 'Exposure of JWT Token Revealing Sensitive Information',
    severity: 'informational',
    score: 0,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
    description: `During the audit, a decoded JSON Web Token (JWT) revealed sensitive information within its payload.`,
    fullDescription: `During the audit, a decoded JSON Web Token (JWT) revealed sensitive information within its payload. The token contains user identifiers and internal metadata such as:
{
}
"id": "superadmin@gmail.com",
"nbf": 1678251327,
"exp": 1678254927,
"iat": 1678251327,
"iss": "https://localhost:44371",
"aud": "http://localhost:4200"
This token, when intercepted or reused, could potentially allow unauthorized access or impersonation of privileged users such as “superadmin”. Moreover, the use of localhost URLs for iss (issuer) and aud (audience) suggests the token may not be properly configured for production environments, leading to weak validation and insecure deployments.`,
    impact: `● Privilege Escalation: Exposure of a token tied to an administrative user may allow an attacker to impersonate high-privilege accounts.
● Information Disclosure: Reveals internal environment details (localhost URLs), token validity period, and authentication structure.
● Replay or Session Hijacking: If not properly expired or validated, tokens may be reused by attackers.
● Weak Configuration: Using test/development claims in production can weaken overall authentication integrity.`,
    recommendation: `1. Do not expose JWTs in logs, URLs, or front-end code. Always handle them securely in authorization headers (Authorization: Bearer <token>).
2. Rotate and revoke exposed tokens immediately via your identity provider or backend.
3. Use environment-specific secrets and ensure that iss and aud correspond to production URLs only.
4. Implement short expiration times (exp) and use refresh tokens securely.
5. Enable signature verification on the server side to prevent forgery or replay.
6. Avoid decoding or storing JWTs client-side unnecessarily; use HttpOnly cookies when possible.`,
    references: [
      'OWASP JSON Web Token (JWT) Cheat Sheet',
      'MITRE CWE-287 – Improper Authentication'
    ],
    status: 'open',
    foundAt: '2025-10-15T10:00:00.000Z'
  }
];

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([]);

  // Mock current user - in real app, this would come from auth context
  const [currentUser] = useState({
    id: 'user-1',
    role: 'user' as const,
    name: 'Test User',
    email: 'scomode@gmail.com'
  });

  // Load initial data from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('auditRequests');
    let initialRequests: AuditRequest[] = [];

    if (savedRequests) {
      initialRequests = JSON.parse(savedRequests);
    }

    // Ensure audit-web-001 exists and is a "Web Audit"
    const existingWebIdx = initialRequests.findIndex((r: AuditRequest) => r.id === 'audit-web-001');

    if (existingWebIdx !== -1) {
      initialRequests[existingWebIdx].auditType = 'web';
      initialRequests[existingWebIdx].companyName = 'Scomode';
      initialRequests[existingWebIdx].vulnerabilities = { critical: 0, high: 1, medium: 1, low: 0, informational: 1, total: 3 };

      // Force update findings to ensure detailed text is present
      initialRequests[existingWebIdx].findings = DEFAULT_WEB_FINDINGS;
    } else {
      const defaultAudit: AuditRequest = {
        id: 'audit-web-001',
        companyName: 'Scomode',
        contactName: 'Web Admin',
        contactEmail: 'admin@web.com',
        contactPhone: '+1234567890',
        auditType: 'web',
        targetUrl: 'https://example.com',
        description: 'Comprehensive web application security assessment',
        priority: 'high',
        methodology: 'OWASP Testing Guide v4.2',
        estimatedDuration: '7 days',
        budget: 'Premium',
        preferredStartDate: '2025-12-11',
        completedAt: '2025-12-22',
        testingPeriod: '14 & 16 Oct 2025',
        reportDelivery: '2025-10-16',
        additionalRequirements: '',
        status: 'approved',
        submittedAt: new Date('2025-12-01').toISOString(),
        progress: 100,
        testingPhase: 'Completed',
        userId: 'user-1',
        vulnerabilities: { critical: 0, high: 1, medium: 1, low: 0, informational: 1, total: 3 },
        findings: DEFAULT_WEB_FINDINGS,
        documents: [],
        timeline: []
      };
      initialRequests.push(defaultAudit);
    }

    setAuditRequests(initialRequests);

    // Always save back to be sure
    localStorage.setItem('auditRequests', JSON.stringify(initialRequests));
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('auditRequests', JSON.stringify(auditRequests));
  }, [auditRequests]);

  const submitAuditRequest = (requestData: Omit<AuditRequest, 'id' | 'submittedAt' | 'status' | 'progress' | 'testingPhase' | 'vulnerabilities' | 'findings' | 'documents' | 'timeline'>) => {
    const newRequest: AuditRequest = {
      ...requestData,
      id: `audit-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      progress: 0,
      testingPhase: 'Pending Approval',
      vulnerabilities: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        informational: 0,
        total: 0
      },
      findings: [],
      documents: [],
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          phase: 'Request Submitted',
          status: 'completed',
          startDate: new Date().toISOString().split('T')[0],
          description: 'Audit request submitted for review'
        }
      ]
    };

    setAuditRequests(prev => [...prev, newRequest]);
  };

  const approveRequest = (requestId: string, testerId: string) => {
    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'assigned' as const,
          testerId,
          assignedTester: 'Security Expert',
          testingPhase: 'Planning & Scoping',
          timeline: [
            ...request.timeline,
            {
              id: `timeline-${Date.now()}`,
              phase: 'Request Approved',
              status: 'completed' as const,
              startDate: new Date().toISOString().split('T')[0],
              description: 'Request approved and assigned to tester'
            }
          ]
        };
      }
      return request;
    }));
  };

  const rejectRequest = (requestId: string, reason: string) => {
    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'rejected' as const,
          timeline: [
            ...request.timeline,
            {
              id: `timeline-${Date.now()}`,
              phase: 'Request Rejected',
              status: 'completed' as const,
              startDate: new Date().toISOString().split('T')[0],
              description: `Request rejected: ${reason}`
            }
          ]
        };
      }
      return request;
    }));
  };

  const updateAuditStatus = (requestId: string, status: AuditRequest['status'], updates?: Partial<AuditRequest>) => {
    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const updatedRequest = {
          ...request,
          status,
          ...updates,
          timeline: [
            ...request.timeline,
            {
              id: `timeline-${Date.now()}`,
              phase: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
              status: 'completed' as const,
              startDate: new Date().toISOString().split('T')[0],
              description: `Status updated to ${status.replace('-', ' ')}`
            }
          ]
        };

        if (status === 'completed') {
          updatedRequest.completedAt = new Date().toISOString();
          updatedRequest.progress = 100;
          updatedRequest.testingPhase = 'Completed';
        }

        return updatedRequest;
      }
      return request;
    }));
  };

  const addFinding = (requestId: string, findingData: Omit<Finding, 'id' | 'foundAt'>) => {
    const newFinding: Finding = {
      ...findingData,
      id: `finding-${Date.now()}`,
      foundAt: new Date().toISOString()
    };

    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const updatedFindings = [...request.findings, newFinding];
        const vulnerabilities = {
          critical: updatedFindings.filter(f => f.severity === 'critical').length,
          high: updatedFindings.filter(f => f.severity === 'high').length,
          medium: updatedFindings.filter(f => f.severity === 'medium').length,
          low: updatedFindings.filter(f => f.severity === 'low').length,
          informational: updatedFindings.filter(f => f.severity === 'informational').length,
          total: updatedFindings.length
        };

        return {
          ...request,
          findings: updatedFindings,
          vulnerabilities
        };
      }
      return request;
    }));
  };

  const updateProgress = (requestId: string, progress: number, phase: string) => {
    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          progress,
          testingPhase: phase
        };
      }
      return request;
    }));
  };

  const uploadDocument = (requestId: string, documentData: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDocument: Document = {
      ...documentData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          documents: [...request.documents, newDocument]
        };
      }
      return request;
    }));
  };

  const generateReport = (requestId: string) => {
    const reportDocument: Document = {
      id: `report-${Date.now()}`,
      name: 'Final Security Audit Report.pdf',
      type: 'PDF',
      size: '5.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      category: 'report',
      downloadUrl: `/reports/final-report-${requestId}.pdf`,
      status: 'ready'
    };

    setAuditRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          documents: [...request.documents, reportDocument],
          reportUrl: reportDocument.downloadUrl
        };
      }
      return request;
    }));
  };

  const requestReaudit = (originalRequestId: string, updates: Partial<AuditRequest>) => {
    const originalRequest = auditRequests.find(r => r.id === originalRequestId);
    if (!originalRequest) return;

    const reauditRequest: AuditRequest = {
      ...originalRequest,
      ...updates,
      id: `reaudit-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      progress: 0,
      testingPhase: 'Pending Approval',
      vulnerabilities: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        informational: 0,
        total: 0
      },
      findings: [],
      documents: [],
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          phase: 'Re-audit Requested',
          status: 'completed',
          startDate: new Date().toISOString().split('T')[0],
          description: `Re-audit requested for ${originalRequest.companyName}`
        }
      ]
    };

    setAuditRequests(prev => [...prev, reauditRequest]);
  };

  const getUserRequests = (userId: string) => {
    return auditRequests.filter(request => request.userId === userId || request.id === 'audit-web-001');
  };

  const getTesterRequests = (testerId: string) => {
    return auditRequests.filter(request => request.testerId === testerId);
  };

  const getPendingRequests = () => {
    return auditRequests.filter(request => request.status === 'pending');
  };

  const value: WorkflowContextType = {
    auditRequests,
    currentUser,
    submitAuditRequest,
    approveRequest,
    rejectRequest,
    updateAuditStatus,
    addFinding,
    updateProgress,
    uploadDocument,
    generateReport,
    requestReaudit,
    getUserRequests,
    getTesterRequests,
    getPendingRequests
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};