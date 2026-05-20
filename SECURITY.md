# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately. Do not open a public issue.

**Preferred:** GitHub Private Vulnerability Reporting — [Report a vulnerability](https://github.com/wranngle/pinchgrab/security/advisories/new)

**Fallback:** Email cody@wranngle.com with subject `pinchgrab: security`

Include:

- Affected version, commit, or branch
- Reproduction steps or proof-of-concept
- Impact assessment (what an attacker gains)
- Any suggested remediation

## Scope

In scope:

- The `pinchgrab` source in this repository (extension, bookmarklet, build scripts)
- The generated `extension/` and `dist/` artifacts produced by this repo

Out of scope:

- Vulnerabilities in upstream browsers, Node, or third-party dependencies (report to the respective project)
- Issues requiring physical access to an already-compromised machine
- Self-XSS or social-engineering scenarios with no realistic attack path
- Findings against forks or modified builds

## What to expect

This is a personal project maintained on a best-effort basis.

- **Acknowledgement:** typically within 7 days
- **Triage and fix:** timeline depends on severity and maintainer availability; no SLA
- **Disclosure:** coordinated via the GitHub advisory once a fix or mitigation is available
- **Credit:** reporters are credited in the advisory unless they request otherwise

## Safe harbor

Good-faith research conducted under this policy will not be pursued. Do not access data that is not yours, degrade service for other users, or retain sensitive data discovered during testing.
