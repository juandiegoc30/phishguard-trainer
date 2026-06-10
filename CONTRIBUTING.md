# Contributing to PhishGuard Trainer

Thank you for considering a contribution. PhishGuard Trainer is an educational, defensive security project. Contributions should help people recognize phishing safely without enabling real-world abuse.

## Contribution principles

- Keep the project defensive, educational, and safe.
- Use fictional organizations, domains, people, phone numbers, and brands.
- Do not include working phishing kits, credential collection, malware, exploit payloads, or instructions for abusing real services.
- Do not submit real phishing emails, real credentials, personal data, private messages, or confidential incident details.
- Prefer clear, beginner-friendly explanations over fear-based or overly technical language.
- Keep Spanish and English content aligned when changing user-facing copy.

## Good contribution ideas

- New fictional training scenarios.
- Better explanations for suspicious and normal signals.
- Accessibility improvements.
- Mobile layout fixes.
- Documentation improvements.
- Defensive resources, reporting channels, or post-incident guidance.
- Tests or validation scripts for scenario data and scoring behavior.
- Small UI improvements that preserve the static, dependency-light nature of the project.

## Contribution workflow

For small fixes, documentation changes, and new fictional scenarios, a pull request is welcome directly.

For larger changes, open an issue first so the scope, safety impact, and maintenance tradeoffs can be discussed before implementation. This is especially useful for changes that add dependencies, alter scoring behavior, expand locales, redesign major UI flows, or introduce new scenario categories.

Recommended flow:

1. Fork the repository.
2. Create a focused branch from `main`.
3. Make the smallest change that fully addresses the issue or improvement.
4. Run the local validation steps below.
5. Open a pull request with a concise summary, screenshots for UI changes, and notes about any safety or accessibility considerations.

Use Conventional Commits for commit messages:

```txt
feat: add fictional payroll reset scenario
fix: preserve scroll position when switching language
docs: clarify scenario safety rules
test: add scoring validation cases
chore: update static server instructions
```

## Scenario contribution guidelines

Scenario data lives in:

```txt
web/assets/js/data.js
```

Each scenario should include:

- `id`: stable, lowercase, URL-safe identifier.
- `title`: short user-facing title.
- `difficulty`: clear difficulty label.
- `type`: message type, such as email or SMS.
- `context`: short setup explaining what the user is reviewing.
- `learning_goal`: what the scenario teaches.
- `mock_ui`: fictional message content shown in the interface.
- `elements`: selectable signals the user can mark.

Each element should include:

- `id`: stable identifier.
- `label`: short name for the signal.
- `display`: exact visible text, link, sender, or clue.
- `is_suspicious`: `true` or `false`.
- `explanation`: why the element is suspicious or normal.

Minimal scenario example:

```js
{
  id: "account-review-example",
  title: "Account review notice",
  difficulty: "Beginner",
  type: "Email",
  context: "You receive a message asking you to review a fictional account notice.",
  learning_goal: "Practice checking sender details, urgency, and safe links.",
  mock_ui: {
    mode: "email",
    sender: "Metro Learning Desk",
    sender_email: "alerts@example.com",
    subject: "Account review needed today",
    body: [
      "Please review your training account before the end of the day.",
      "Use the internal training portal or contact your help desk if unsure."
    ],
    link_preview: "https://example.com/training-review",
    footer: "Metro Learning Desk"
  },
  elements: [
    {
      id: "sender-domain",
      label: "Example sender domain",
      display: "alerts@example.com",
      is_suspicious: false,
      explanation: "The address uses a reserved example domain for safe training content."
    },
    {
      id: "time-pressure",
      label: "Urgent deadline",
      display: "before the end of the day",
      is_suspicious: true,
      explanation: "Urgency can pressure people into acting before verifying a request."
    }
  ]
}
```

### Scenario safety rules

- Use reserved/example domains when possible, such as `example.com`, `.test`, or clearly fictional domains.
- Do not use real bank, government, courier, payroll, cloud, or social media brand names.
- Do not include real phone numbers, real payment instructions, real wallet addresses, or real login URLs.
- Do not include operational steps that would help someone build or deliver phishing.
- Make malicious signals educational, not functional.
- If the scenario is inspired by a real pattern, rewrite it as a fictional case.

## Bilingual content

The app supports Spanish and English. When changing shared UI text:

- Update both `uiText.es` and `uiText.en`.
- Keep meaning equivalent, not necessarily word-for-word identical.
- Use Colombia context for Spanish scenarios and United States context for English scenarios unless a future change intentionally expands locales.
- Validate that long text still fits on mobile and desktop.

## Code style

- Keep the app static: HTML, CSS, and vanilla JavaScript.
- Avoid adding build tools or new runtime dependencies unless there is a strong reason.
- Keep changes scoped and easy to review.
- Prefer readable functions and explicit data structures.
- Do not minify source files in commits.
- Preserve accessibility basics: semantic HTML, readable labels, keyboard-friendly controls, and sufficient contrast.

## Local validation

Serve the `web/` directory with a static HTTP server:

```bash
cd web
python3 -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

Before submitting a change, check:

- Home page renders in Spanish and English.
- Language toggle does not unexpectedly move the page.
- Hash anchors work: `#hero`, `#what-is-phishing`, `#scenarios`, `#resources`, `#ethics`.
- Scenario cards open correctly.
- Scoring works after selecting suspicious elements.
- Layout remains usable on mobile and desktop.
- Interactive controls can be reached and operated with the keyboard.
- Focus indicators are visible and do not get hidden behind the sticky header.
- Labels, headings, and button/link text remain understandable with a screen reader.
- Color contrast remains readable for normal text, labels, and result badges.

Run JavaScript syntax checks:

```bash
node --check web/assets/js/app.js
node --check web/assets/js/data.js
node --check web/assets/js/scoring.js
node --check web/sw.js
```

## Pull request checklist

- The contribution is defensive and educational.
- No real brands, credentials, personal data, or live phishing infrastructure are included.
- Spanish and English copy are updated when needed.
- Scenario explanations are clear and beginner-friendly.
- Local static server testing was performed.
- JavaScript syntax checks pass.
- Keyboard and screen reader basics were checked for user-facing changes.
- Documentation is updated if behavior, setup, or project structure changed.

## Reporting unsafe content

If you notice content that could enable abuse, expose personal data, impersonate a real organization, or otherwise conflict with the project's defensive purpose, please report it using the process in [SECURITY.md](SECURITY.md).
