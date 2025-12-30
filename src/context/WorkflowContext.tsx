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

const DEFAULT_WEB_FINDINGS: Finding[] = [
  {
    id: 'finding-1',
    title: 'Outdated PHP Version (PHP 7.4.33)',
    severity: 'medium',
    description: `Upgrade PHP to a supported version (PHP 8.2 or PHP 8.3) and remove the X-Powered-By header to prevent version disclosure.`,
    fullDescription: `The target server is running PHP version 7.4.33, which reached its Official End-of-Life (EOL) on November 28, 2022. Operating an EOL software version means the vendor no longer provides security patches, leaving the system vulnerable to any newly discovered exploits. Additionally, the server explicitly discloses this version information via the 'X-Powered-By' HTTP response header, which provides attackers with precise information for selecting targeted exploits during the reconnaissance phase.`,
    impact: `Using an outdated PHP version can lead to multiple security risks, including:

● Remote Code Execution (RCE): Known vulnerabilities in EOL versions can be exploited to execute arbitrary code on the website.
● Privilege Escalation: Attackers may leverage flawed PHP functions or memory bugs to gain elevated access.
● Denial of Service (DoS): Performance vulnerabilities or crashes can be triggered in outdated versions.
● Sensitive Information Disclosure: Weaknesses may allow attackers to extract configuration or file contents.
● Weak Protection Against Modern Attacks: New vulnerabilities discovered after EOL will not be patched, leaving permanent gaps.
● Increased Reconnaissance Value: Disclosed version information helps attackers craft more targeted exploits.

In a production environment, these risks collectively increase the likelihood of full website compromise.`,
    recommendation: `To secure the application and underlying infrastructure:

1. Upgrade PHP to a Supported Version
   o Move to PHP 8.2 or PHP 8.3, which have active security support.
   o Review the official PHP migration guides for compatibility.
2. Perform Compatibility Testing
   o Validate application functionality and dependencies (frameworks, plugins, CMS components) before upgrading.
3. Disable Version Disclosure
   o Remove X-Powered-By header via php.ini or .htaccess to prevent website fingerprinting.
   o Example: expose_php = Off
4. Maintain Regular Patch Cycles
   o Establish a routine update process for website components, PHP modules, and frameworks.
5. Update the Web Server & WAF Rules (Optional but Recommended)
   o Ensure Apache and ModSecurity are updated to align with the PHP upgrade.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 6.5,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L'
  },
  {
    id: 'finding-2',
    title: 'Clickjacking Vulnerability (UI Redressing Attack)',
    severity: 'medium',
    description: `Implement X-Frame-Options (DENY/SAMEORIGIN) or Content-Security-Policy (frame-ancestors) to prevent the application from being loaded in a malicious iframe.`,
    fullDescription: `The application lacks proper frame-protection headers, making it vulnerable to Clickjacking (also known as UI Redressing). This occurs when an attacker uses transparent or opaque layers to trick a user into clicking a button or link on another page when they were intending to click on the top-level page. By embedding the target site within a malicious iframe, an attacker can hijack user interactions and perform unauthorized actions in the context of the user's active session.`,
    impact: `If exploited, this vulnerability can allow attackers to:

1. Perform Unauthorized User Actions
Attackers can trick users into clicking hidden buttons, such as:
● “Claim Reward”
● “Login”
● “Proceed”
● “Submit”
This may lead to unintended operations being carried out silently.

2. Social Engineering & Phishing Attacks
Victims can be misled into believing they are interacting with the real site, enabling:
● Credential harvesting
● Redirection to malicious pages
● Fake reward or offer scams

3. Account or Session Abuse
If users are authenticated while accessing the malicious page:
● Attackers can perform authenticated actions on behalf of the user.

4. Malware Distribution
Frames can be used to:
● Deliver phishing popups
● Open hidden malicious downloads
● Display deceptive overlays

5. Reputation Damage
Exploitation of clickjacking can cause:
● Loss of trust
● Business disruption
● Misuse of brand identity`,
    recommendation: `To mitigate Clickjacking attacks, implement the following:

1. Add X-Frame-Options Header
Prevents the site from being loaded inside iframes:
● DENY (recommended)
● SAMEORIGIN (if internal embedding is required)

2. Configure CSP Frame-Ancestors Directive
This is the modern recommended defense:
● Allow only your domain to load the site.
● Example: frame-ancestors 'self';

3. Avoid Embedding the Site in External Domains
Ensure no third-party applications require framing.

4. Implement Server-Side Security Policies
Apply security headers at:
● Apache config
● Nginx config
● CDN / WAF (Cloudflare, AWS, etc.)

5. Perform Security Regression Testing
Once fixed, verify that:
● Iframes fail to load the website.
● Exploit page displays a browser denial/error.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 6.3,
    vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N'
  },
  {
    id: 'finding-3',
    title: 'Vulnerable JS Library',
    severity: 'medium',
    description: `Upgrade jQuery UI to the latest stable version and implement a regular dependency review process to mitigate XSS and prototype pollution risks.`,
    fullDescription: `The application is including an outdated version of the jQuery UI library which contains known security vulnerabilities. These vulnerabilities, including Cross-Site Scripting (XSS) and Prototype Pollution flaws, could allow an attacker to execute arbitrary JavaScript code in the context of the victim's session. Using components with known vulnerabilities is a significant risk as public exploits are often readily available.`,
    impact: `If exploited, these vulnerabilities may allow attackers to:

● Execute XSS attacks through vulnerable UI elements
● Manipulate or hijack UI components
● Bypass input validation in widgets
● Perform DOM-based attacks
● Compromise user interactions or steal sensitive data
● Use known exploits available publicly due to outdated versions

As the affected library is widely used across the site, the impact can extend to multiple pages and functionalities.`,
    recommendation: `To mitigate the vulnerability, take the following actions:

1. Upgrade jQuery UI to the Latest Stable Version
   o Install the most recent, secure release from the official repository.
   o Ensure compatibility testing across all UI components.
2. Remove Deprecated or Unused Components
   o Reduce the attack surface by loading only required modules.
3. Implement a Regular Dependency Review Process
   o Periodically update third-party libraries and monitor CVE advisories.
4. Enable a Content Security Policy (CSP)
   o Helps reduce exploitability even if a vulnerable script exists.
5. Avoid Hosting Outdated Local Copies
   o Replace outdated local JS files with updated versions`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 6.1,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N'
  },
  {
    id: 'finding-4',
    title: 'Missing Rate Limiting & Anti-Automation Controls on Contact Form',
    severity: 'medium',
    description: `Implement server-side rate limiting, CAPTCHA (reCAPTCHA/hCaptcha), and CSRF protection on contact forms to prevent automated spam and abuse.`,
    fullDescription: `The application's contact form does not implement any mechanisms to prevent automated submissions. Without rate limiting or anti-automation controls (such as CAPTCHA), attackers can programmatically submit the form thousands of times. This can be used for spreading spam, performing denial-of-service (DoS) attacks on backend resources or email infrastructure, and damaging the domain's email reputation.`,
    impact: `● Spam & Abuse of Contact Functionality:
Attackers can submit thousands of automated messages, using your form to send spam through your website.
● Email Website Reputation Damage:
Continuous spam through your domain can cause mail service providers to blacklist your domain/IP, affecting legitimate business communication.
● Resource Exhaustion / Denial of Service:
High-volume automated requests may consume CPU, memory, and bandwidth, potentially leading to degraded performance or temporary service unavailability.
● Information Noise & Operational Disruption:
Flooding the inbox with junk or automated submissions may cause operational delays and lead to missed legitimate customer or client messages.
● Facilitation of Brute Force & Enumeration Attacks:
Attackers can use the form to automate testing of payloads, fuzzing, or enumeration attempts due to the lack of request throttling.`,
    recommendation: `To mitigate this vulnerability, the following measures should be implemented:

1. Enable Server-Side Rate Limiting
   o Restrict the maximum number of requests per minute from a single IP.
   o Return HTTP 429 (Too Many Requests) for excessive submissions.
   o Recommended limit: 5–10 requests per minute for public forms.
2. Implement CAPTCHA or reCAPTCHA
   o Integrate Google reCAPTCHA v2/v3 or hCaptcha to block automated bots.
   o Apply CAPTCHA only after 1–2 successful submissions to reduce user friction.
3. Add CSRF Protection
   o Prevent request forgery by validating CSRF tokens for all form submissions.
4. Use Honeypot Techniques
   o Add hidden fields that normal users won't fill; bots often will.
   o Reject such submissions automatically.
5. Introduce Time-Based Submission Checks
   o Reject forms submitted unrealistically fast (e.g., under 1–2 seconds).
   o Helps detect automated scripts.
6. Implement WAF or Firewall Rules
   o Block or throttle suspicious IPs.
   o Monitor form submission patterns for anomalies.
7. Log and Monitor Submission Activity
   o Generate alerts for spikes in submission volume.
   o Create IP blacklists or dynamic blocking rules.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 5.9,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L'
  },
  {
    id: 'finding-5',
    title: 'Missing Security Headers',
    severity: 'medium',
    description: `Configure the web server to include all recommended security headers (HSTS, CSP, X-Frame-Options) to prevent various web-based attacks.`,
    fullDescription: `During the assessment, the application was found to be missing several essential security headers. Without these headers, the browser may handle content insecurely, making the application more vulnerable to attacks such as XSS, clickjacking, MIME-type spoofing, referrer information leakage, and misuse of browser features. This significantly increases the overall attack surface and weakens the application’s security posture.`,
    impact: `If these headers remain unset, an attacker may:
● Intercept or manipulate user traffic by forcing the browser to access the site over nonsecure HTTP (HSTS missing).
● Inject malicious scripts (XSS) due to absence of a strong Content Security Policy.
● Perform clickjacking attacks by embedding the application in an iframe (X-FrameOptions missing).
● Exploit MIME-type mismatches to execute untrusted code (X-Content-Type-Options missing).
● Obtain sensitive referrer information, including internal URLs or tokens (ReferrerPolicy missing).
● Abuse browser features such as camera, microphone, geolocation, or sensors (Permissions-Policy missing).

Overall, missing security headers weaken the application’s defensive posture and expose users to various browser-based attack vectors.`,
    recommendation: `To improve the application’s security posture, implement the following security headers with appropriate secure configurations:

1. Enable Strict-Transport-Security (HSTS)
   o Enforce HTTPS for all user connections.
   o Ensure all subdomains also use HTTPS.
   o Include the domain in preload lists for stronger protection.
2. Implement a Content Security Policy (CSP)
   o Restrict which sources can load scripts, styles, images, and frames.
   o Block unsafe inline scripts and disallow untrusted content.
   o Prevent the loading of malicious or injected site resources.
3. Configure X-Frame-Options
   o Prevent the website from being embedded in iframes.
   o Protect against clickjacking attacks.
   o Allow framing only if absolutely required.
4. Enable X-Content-Type-Options
   o Prevent browsers from MIME-type sniffing.
   o Ensure files are interpreted only as their declared content types.
   o Reduce risk of malicious file execution.
5. Apply a Referrer-Policy
   o Limit the amount of URL and user data sent to external sites.
   o Reduce information leakage during cross-site navigation.
6. Set a Permissions-Policy
   o Restrict unnecessary browser features such as camera, microphone, and location access.
   o Reduce the risk of misuse of browser APIs.
   o Apply the principle of least privilege to client-side capabilities.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 5.1,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N'
  },
  {
    id: 'finding-low-1',
    title: 'Sub Resource Integrity (SRI) Attribute Missing',
    severity: 'low',
    description: `Implement SRI attributes for all external JavaScript and CSS resources to ensure file integrity and prevent supply-chain attacks.`,
    fullDescription: `The application loads external JavaScript/CSS resources from third-party CDNs without using a Subresource Integrity (SRI) attribute. Without SRI, the browser cannot verify whether the external file has been tampered with. If the CDN is compromised, attackers can inject malicious code into these files, which will then load on the site without detection.`,
    impact: `If exploited, this vulnerability can allow attackers to:
● Inject malicious scripts or styles through compromised third-party CDN files.
● Execute Cross-Site Scripting (XSS) attacks without modifying the application code.
● Steal user information, cookies, or session data.
● Redirect users to malicious websites.
● Execute arbitrary code in the context of the user’s browser.
● Perform supply-chain attacks by altering CDN-hosted libraries.

This risk becomes more severe if the affected resource is widely used across the site (e.g., jQuery, Bootstrap, Slick Carousel, etc.).`,
    recommendation: `To mitigate this issue, implement the following best practices:

1. Enable Subresource Integrity (SRI) for External Scripts & Styles
   o Ensure every CDN-hosted CSS and JS file includes an integrity hash.
   o The browser will block the resource if it is modified unexpectedly.
2. Use the crossorigin Attribute Where Required
   o Some CDNs require crossorigin="anonymous" for SRI validation.
3. Download and Host Critical Libraries Locally
   o Avoid external dependencies for key frontend components.
   o Reduces risk of supply-chain compromise.
4. Periodically Review and Update Integrity Hashes
   o Update integrity values when upgrading a library version.
5. Audit External Dependencies Regularly
   o Ensure all external scripts and styles follow SRI and security standards.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 3.7,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N'
  },
  {
    id: 'finding-low-2',
    title: 'Absence of Anti-CSRF Tokens',
    severity: 'low',
    description: `Implement anti-CSRF tokens for all state-changing forms to prevent unauthorized request forgery.`,
    fullDescription: `The application’s contact form does not include Anti-CSRF tokens, allowing attackers to trick users into unknowingly submitting requests on their behalf. Because the website cannot verify whether a request was intentionally sent by the user, the form becomes vulnerable to Cross-Site Request Forgery attacks. This issue indicates missing security controls and may expose other sensitive functionalities if similar forms lack CSRF protection.`,
    impact: `If exploited, this vulnerability allows attackers to:
● Force a user to execute unwanted actions on the application.
● Automatically submit forms on behalf of the victim.
● Potentially spam the target email endpoint using victim browser sessions.
● Abuse the website by generating malicious or automated POST requests.
● Combine with XSS attacks — making it possible for attackers to bypass Same-Origin Policy and steal sensitive information from responses.

While the contact form itself may seem low-impact, the absence of CSRF protection across the application indicates improper security controls, posing a risk if reused on sensitive endpoints.`,
    recommendation: `To mitigate CSRF attacks, implement the following:

1. Add Anti-CSRF Tokens
   ● Generate a unique, unpredictable token per session or per request.
   ● Include it in all POST forms and validate it on the website.
   ● Reject any request with missing or invalid tokens.
2. Use SameSite Cookies
   Configure session cookies with:
   Set-Cookie: PHPSESSID=xyz; SameSite=Lax; Secure; HttpOnly
3. Avoid Using Third-Party Form Handlers
   The contact form is posting to validthemes.net (external server).
   Instead:
   ● Process form submissions on your own domain.
   ● Handle CSRF validation on your website.
4. Implement CAPTCHA
   To reduce automated CSRF spam attempts.
5. Check Other Forms
   Ensure all sensitive forms across the entire application (login, register, admin pages, profile update) also implement CSRF protection.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 3.1,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N'
  },
  {
    id: 'finding-low-3',
    title: 'Cross-Domain JavaScript Source File Inclusion',
    severity: 'low',
    description: `Download and host third-party JavaScript files on your own domain to mitigate supply-chain risks and external script dependencies.`,
    fullDescription: `The application includes JavaScript files hosted on an external third-party CDN. In this case, the site loads the following script from a remote domain: <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-elementbundle.min.js"></script>. This means the website depends on an external domain for client-side functionality. If the third-party CDN is ever compromised, unavailable, or maliciously modified, it could lead to security risks such as tampered scripts being executed on the site.`,
    impact: `● Low likelihood, but high potential impact if exploited.
● If the external CDN is compromised, an attacker can inject malicious JavaScript into the website.
● Possible consequences include:
  o Unauthorized script execution (XSS-like behaviour)
  o Credential theft or session hijacking
  o Forced redirects to malicious domains
  o Malware distribution via injected scripts
  o Disruption of website functionality if the CDN becomes unavailable

Since the CDN (jsDelivr) is reputable and the script is non-sensitive (UI library), the practical risk remains low, but still part of the supply-chain attack surface.`,
    recommendation: `1. Self-host third-party JavaScript files
   o Download the Swiper JS bundle and serve it from your own domain instead of relying on external hosting.
2. Apply a strict Content Security Policy (CSP)
   Limit permitted script sources:
   Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net;
3. Monitor third-party libraries regularly
   o Track version updates
   o Validate checksums
   o Remove unused JS dependencies to reduce risk exposure
4. Avoid loading scripts directly from unknown or unmanaged domains
   o Maintain a vetted list of trusted CDN sources`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 3.1,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N'
  },
  {
    id: 'finding-low-4',
    title: 'Forced Client-Side Redirection on Direct POST Requests (Security-by-Obscurity Control)',
    severity: 'low',
    description: `Implement server-side validation and enforcement for POST requests instead of relying on client-side JavaScript redirects.`,
    fullDescription: `When a direct POST request is sent to the conmail.php endpoint, the website responds with an HTML snippet containing a JavaScript redirect: <script type='text/javascript'> document.location = 'index.php'; </script>. This indicates that the application is using client-side JavaScript redirection to route users back to the home page if the request does not originate from the intended form submission workflow. This behaviour appears designed to reduce automated abuse, but it is not a security control, as the endpoint still processes the POST request normally before issuing the redirect.`,
    impact: `● Weak deterrent against automated bots: The redirect only affects browsers, not automated scripts (curl, Postman, bots), which still reach the endpoint successfully.
● No protection against automated spam or injection: Attackers can still send mass POST requests or malicious payloads before the redirect executes.
● False sense of security: Relying on JavaScript redirection gives the impression of protection, but it does not prevent spam submissions, injection attempts, or enumeration.
● Client-side only enforcement: Security should not rely solely on client-side mechanisms, as they can be bypassed entirely.

Overall, this mechanism does not introduce direct vulnerability, but it also does not effectively prevent misuse.`,
    recommendation: `To properly secure the endpoint:

1. Implement Server-Side Validation
   Ensure the backend verifies required parameters, input format, CSRF tokens, and origin of submission.
2. Add Rate Limiting
   Use server- or WAF-level rate limiting to prevent spam and brute-force form submissions.
3. Use Google reCAPTCHA or hCaptcha
   Reduce automated form abuse effectively.
4. Sanitize and Validate Inputs
   Protect against XSS, email-header injection, command injection, and spam attacks.
5. Remove JavaScript-based enforcement
   Instead, enforce logic server-side by rejecting requests without proper form identifiers, missing headers, or non-browser user-agents.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 2.6,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L'
  },
  {
    id: 'finding-low-5',
    title: 'Server Leaks Information via "X-Powered-By" HTTP Response Header',
    severity: 'low',
    description: `Disable the "X-Powered-By" header in server configurations and upgrade PHP to a supported version to prevent information disclosure.`,
    fullDescription: `The web server discloses its underlying technology through the X-Powered-By HTTP response header. In this case, the application reveals: X-Powered-By: PHP/7.4.33. This exposes the backend language and version to attackers, making it easier to identify known vulnerabilities, outdated components, and version-specific exploits. Information disclosure of server technologies is considered poor security hygiene and can contribute to reconnaissance during targeted attacks.`,
    impact: `If exploited, this vulnerability may allow attackers to:
● Identify the backend technology (PHP) and its exact version.
● Map known vulnerabilities associated with PHP 7.4.33 (which is End-of-Life).
● Launch version-specific attacks, including Remote Code Execution (RCE), Denial of Service (DoS), or memory corruption exploits.
● Improve the accuracy of automated reconnaissance tools during an attack.
● Increase the effectiveness of exploit-based attacks as part of the kill chain.

Although no direct exploitation occurs simply from the header, it increases the attack surface by exposing unnecessary internal details.`,
    recommendation: `To secure the application environment:

1. Disable the "X-Powered-By" Header
   o Remove or disable the header in server configuration (Apache, Nginx, PHP).
2. Upgrade PHP Immediately
   o PHP 7.4 reached End-of-Life (EOL) in November 2022.
   o Upgrade to PHP 8.2 or 8.3, which receive active security patches.
3. Harden Server Response Headers
   o Avoid exposing server or framework information in any HTTP header.
   o Disable Server header leakage where possible.
4. Implement Web Server Security Best Practices
   o Use a WAF (e.g., ModSecurity) to normalize response headers.
   o Apply regular patching to server software and backend frameworks.`,
    status: 'open',
    foundAt: new Date().toISOString(),
    score: 2.1,
    vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'
  }
];

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([]);

  // Mock current user - in real app, this would come from auth context
  const [currentUser] = useState({
    id: 'user-1',
    role: 'user' as const,
    name: 'Test User',
    email: 'test@example.com'
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
      initialRequests[existingWebIdx].companyName = 'Web Audit';
      initialRequests[existingWebIdx].vulnerabilities = { critical: 0, high: 0, medium: 5, low: 5, informational: 0, total: 10 };

      // Force update findings to ensure detailed text is present
      initialRequests[existingWebIdx].findings = DEFAULT_WEB_FINDINGS;
    } else {
      const defaultAudit: AuditRequest = {
        id: 'audit-web-001',
        companyName: 'Web Audit',
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
        preferredStartDate: '2025-05-20',
        completedAt: '2025-06-05',
        additionalRequirements: '',
        status: 'approved',
        submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 100,
        testingPhase: 'Completed',
        userId: 'user-1',
        vulnerabilities: { critical: 0, high: 0, medium: 5, low: 5, informational: 0, total: 10 },
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