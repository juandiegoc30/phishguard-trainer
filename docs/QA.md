# QA checklist

Use this checklist before opening a pull request or publishing a new release.

## Local run

- Serve the site through HTTP from `web/`.
- Open `/` and confirm the home page loads without console errors.
- Toggle ES/EN and confirm copy, buttons, cards, and routes update correctly.
- Refresh `/`, `/#what-is-phishing`, `/#scenarios`, and `/#resources`.
- In local Live Server, refresh a scenario hash route such as `/#/scenario/co-bank-urgent-verification`.

## Training flow

- Open each scenario card.
- Select suspicious and normal elements.
- Submit and confirm score, status badges, explanations, retry, next scenario, and more scenarios links.
- Confirm all scenarios have at least one suspicious element and no real credential collection.

## Accessibility

- Navigate the header, cards, scenario options, and result actions with keyboard only.
- Confirm focus styles are visible.
- Confirm the language toggle has a clear accessible name.
- Confirm the scenario selection group has a visible legend.
- Test with reduced motion enabled and confirm content remains visible.

## Responsive

- Check 320px, 375px, 768px, 1024px, and desktop widths.
- Confirm hero title, buttons, cards, scenario mockups, selection panel, and 404 layout do not overlap.
- Confirm images scale without layout jumps.
- On viewports ≤ 760px: confirm the desktop nav is hidden and the hamburger button is visible.
- Open the hamburger menu and confirm all nav links appear and work; confirm the menu closes after tapping a link or tapping outside.

## 404 and routing

- Open `/404.html` directly.
- Open an unknown path and confirm it returns to the SPA route safely.
- From `/#scenarios`, scroll and click the brand link; it should return to the top of the home page.
- Confirm GitHub Pages fallback behavior after deployment.

## Content safety

- Review [CONTENT_SAFETY.md](CONTENT_SAFETY.md).
- Confirm scenarios use fictional organizations, domains, and messages.
- Confirm no scenario asks the learner to enter real credentials.
- Confirm external reporting links are legitimate and current before release.
