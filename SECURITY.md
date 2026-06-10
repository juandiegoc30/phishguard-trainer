# Security Policy

PhishGuard Trainer is a defensive education project. This policy explains how to report security issues, unsafe content, and misuse risks.

## Scope

Please report:

- Vulnerabilities in the static app code.
- Bugs that expose user data or unexpectedly persist sensitive information.
- Unsafe scenario content that uses real brands, real people, real domains, real phone numbers, or real credentials.
- Content that could help someone perform phishing, credential theft, malware delivery, or social engineering.
- Links or resources that point to unsafe, misleading, or compromised destinations.
- Accessibility or UI issues that could cause users to misunderstand training results in a security-relevant way.

Out of scope:

- Requests to add offensive tooling.
- Requests to clone real brands or login pages.
- Reports containing real credentials, private messages, or personal data.
- Generic vulnerability scanner output without a clear issue affecting this project.

## How to report

If the repository has private vulnerability reporting enabled, use that first.

Otherwise, open a GitHub issue with a concise description, unless the report contains sensitive details. For sensitive reports, contact the maintainer privately through the contact method listed on the maintainer's GitHub profile.

Do not include real credentials, live phishing URLs, personal data, or confidential incident artifacts in public issues.

## What to include

For code or behavior issues:

- A short summary.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Browser and operating system, if relevant.
- Screenshots only if they do not expose sensitive information.

For unsafe content:

- The file and section where it appears.
- Why it may be unsafe.
- A safer wording or fictional replacement, if possible.

## Safe handling expectations

When researching or reporting an issue:

- Do not attempt to collect credentials.
- Do not interact with real victims.
- Do not send test phishing messages.
- Do not include live malicious links in public reports.
- Do not upload malware, phishing kits, or exploit payloads.
- Use fictional examples and sanitized evidence.

## Supported versions

This project is currently maintained from the `main` branch. Security fixes are expected to target the latest version of the static site.

## Project data and privacy

PhishGuard Trainer is designed to run in the browser as a static application. It does not intentionally collect credentials, send messages, or transmit personal data to a backend. Language preference may be stored locally in the browser through `localStorage`.

## Response expectations

This is a small open source educational project, so response times may vary. The maintainer will prioritize reports that:

- Affect user safety or privacy.
- Introduce realistic phishing abuse risk.
- Break the defensive purpose of the project.
- Impact the integrity of scoring or training content.
