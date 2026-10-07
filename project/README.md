# DKB mobile UI prototype

React application refined against the supplied Home, Girokonto, Transfer and More reference images. This is a local demonstration interface, with no banking integration or authentication.

## Run

Use Node.js 22.12 or newer (Node 24 LTS also works).

```sh
npm ci
npm run dev
```

Open the address printed by Vite. For a production build:

```sh
npm test
npm run build
npm run preview
```

Serve `dist/` over HTTPS (or localhost) for service-worker and PWA support. Opening `index.html` directly from the filesystem does not run the application. Relative asset paths also support hosting beneath a subdirectory.

## Screens and interactions

- **Home:** the Girokonto card opens transactions. Transfer opens its own view; More opens the bottom sheet. The eye and Personalize control the shared balance visibility setting.
- **Transfer:** all seven specified previous transfers are shown, including the two-line Stichting IBAN/reference. Search filters recipients or IBANs. Selecting a row prefills the transfer form.
- **New Transfer:** enter recipient, IBAN, amount and reference, review, then explicitly confirm a demo transfer. Confirmation updates the local shared balance and adds a transaction. No payment is sent. The IBAN check validates format only, not account existence or checksum, so the supplied example IBANs remain usable.
- **Templates:** select “Save recipient as template” when creating a transfer, then reuse it from Templates after confirmation.
- **Photo Transfer & QR:** choose an image and enter payment details manually. The image stays local and its temporary URL is revoked when no longer needed. Automated recognition is not connected.
- **More:** Transactions opens Girokonto; Account details displays the IBAN with a copy control; Deposit Cash allows an amount up to €999 and displays a local preview without issuing a deposit code. Tap outside, the handle, the title or blank sheet space to dismiss; a downward drag on the handle or Escape also dismisses it.
- **Bottom tabs:** Home, Cards, Orders, Products and Profile are selectable. Cards includes a local freeze toggle, Orders links to Transfer, Products expands account information, and Profile shares the visibility setting.
- As in the references, bottom tabs appear on the main sections; Girokonto and Transfer use their own back-navigation headers.

## Backstage controls

- **Balance:** hold the Home header for **2 seconds**, or double-click/double-tap it. Enter a number and select Save. Home's total, Girokonto card and account detail header all read the same `globalBalance`, initially **0.71**.
- **Transactions:** hold any transaction for **800 ms**. Edit its icon, title, signed amount, date and description, then select Save. Positive amounts become teal and incoming transfer arrows turn downward; negative amounts become white and outgoing transfer arrows turn upward.
- **Keyboard:** focus the Home title or a transaction row and hold Enter or Space. Escape closes the editor; Tab stays inside the modal.
- **Privacy:** the eye button hides balances and transaction amounts across screens.
- **Search:** the account search button filters titles, dates and descriptions.

Backstage draft changes are applied only on Save. Cancel, Escape and tapping outside the modal discard the draft. Balances, transactions and templates are held in memory and reset on reload. Backstage transaction edits deliberately do not recalculate the manually overridden balance; confirming a demo transfer subtracts its amount from that balance.

## Implementation map

- `src/state/BankingContext.jsx`: shared reducer/context, initial balance, immutable updates, amount validation, and derived `isPositive`.
- `src/hooks/useLongPress.js`: one timer for touch/mouse/keyboard, 10px movement tolerance, cancellation on scroll/release/cancel/multiple touches/blur/unmount, context-menu suppression and post-hold click suppression. Touch-start and touch-move are not prevented, preserving native scrolling.
- `src/components/Editors.jsx`: balance and transaction forms with isolated drafts.
- `src/components/Modal.jsx`: focus containment/restoration, Escape, scroll locking, accessible dialog and backdrop.
- `src/components/Screens.jsx`: Home and account views consuming the same store.
- `src/components/TransactionRow.jsx`: persistent row IDs, merchant icons and signed amount styling.
- `src/components/Transfer.jsx`: reuse/search, local form/review flow, templates and photo input.
- `src/components/MoreSheet.jsx`: bottom sheet, account details, cash-deposit preview and personalization.
- `src/components/SecondaryScreens.jsx`: bottom-tab interactions.
- `src/data/transfers.js`: seven reference recipients, IBANs and starting amounts.
- `src/styles.css`: compiled Tailwind 4 plus explicit mobile layout rules and reduced-motion support.
- `vite.config.js`: production-only offline shell and locally bundled fonts/assets.

## Visual audit decisions

- Removed oversized layout metrics: 14px screen gutters, 64px transaction rows, 15px transaction names, 12px metadata, 24px Home balance and 32px account balance at a 360px viewport.
- No drawn status bar, clock, battery, Wi-Fi or home indicator. Hardware insets use `env(safe-area-inset-*)`.
- Main panels use `rounded-2xl` (16px) and inner action buttons use `rounded-xl` (12px).
- Exact specified backgrounds/borders: `#091018`, `#121c2a`, 1px `#1e2d42`; navigation `#0b131a` with 1px `#182435`.
- Active navigation icon uses `#0066ff`; positive amounts use `#52b69a`; negative amounts use `#ffffff`.
- The account view has a sticky header and no bottom navigation, matching the reference. Transaction headings/order, including the trailing September heading, preserve the supplied screenshot structure.
- Removed invalid nested buttons, duplicate transaction keys, runtime Tailwind CDN dependency, heavy card shadows and the extra detail-screen eye icon.
- Balance formatting follows the explicit request (`€0,71`, `−€300,00`). Transaction and portfolio decimals follow the screenshot's dot notation.

The 237px-wide references do not supply the proprietary typeface or official vector merchant artwork. Locally bundled Inter, Lucide icons and SVG/CSS logo approximations are used. Layout, colors and interactions have been refined, but absolute pixel identity cannot be certified from these sources. All flows are local simulations.

## Validation

`npm test` passes 28 checks covering gesture timing/cancellation, focus restoration, reducer invariants, shared balances, transaction editing, transfer search/prefill/confirmation/templates, modal dismissal, navigation and privacy masking. Production build succeeds. Edge/Chromium mobile checks also pass for touch interactions, sheet alignment, 320/360/390/430px layouts, offline reload and Transfer navigation, with no browser runtime errors. Preview images are saved in `outputs/`.

The original starter files are preserved in `work/original/`. Tailwind scans only `src/`, excluding these backups from the production stylesheet.
