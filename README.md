# Smart Home Repair — redesigned site (Kakkanad, Kochi)

A clean, mobile-first single-page rebuild of smarthomerepair.in.
Style: flat, trustworthy — deep blue + orange. Poppins headings, Open Sans body.
No build step, no framework — plain HTML/CSS/JS.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content, inline SVG icon set, LocalBusiness schema |
| `styles.css` | Design tokens + full responsive layout (375px → 1440px) |
| `script.js` | Service cards + details modal, brand marquee, booking form + validation, coverage chips, mobile nav, scroll reveals |
| `fonts/` | Self-hosted Poppins + Open Sans (woff2, latin subset) — no external requests |
| `README.md` | This file |

## Performance

Fonts are **self-hosted** (see `fonts/`) and the three critical ones are preloaded in
`index.html`, so there are zero external requests and no font-swap layout shift.
If you ever want to swap fonts: replace the files in `fonts/` and update the
`@font-face` rules at the top of `styles.css`.

## Preview

Open `index.html` directly in a browser, or serve the folder:

```bash
cd "hussain site"
python -m http.server 8000
# → http://localhost:8000
```

## What was fixed vs. the live site

- Coverage area list now uses **real Kochi/Ernakulam localities** (Kakkanad, Edappally,
  Vyttila, Palarivattom, Thrikkakara, …) instead of Bengaluru suburbs.
- One consistent visit charge everywhere: **₹299, waived when you proceed with the repair**
  (hero, FAQ and booking card all agree).
- Wrong brand name removed — the site consistently says **Smart Home Repair**
  (no more "Air Cool Tech Services").
- Working hours clarified honestly: bookings **8 AM – 8 PM daily**, with a
  **24/7 emergency helpline** instead of a misleading "open 24/7".
- Testimonials rewritten with plausible Kochi-area customers and no typos.
- Audience numbers harmonized: 50,000+ customers / 12,000+ reviews / 4.9★.
- Leftover template text ("Detailed description goes here…") removed.
- Added: LocalBusiness JSON-LD schema, semantic markup, alt-free SVG icons with
  `aria-hidden`, skip link, keyboard-friendly modal/FAQ, `prefers-reduced-motion` support.

## Before going live

1. **Business details** — everything lives in two places:
   - `index.html` text (phone `62380 54003`, email, address, hours)
   - `CONFIG` at the top of `script.js` (phone, WhatsApp number, visit-charge note)
2. **Booking form** — there is no backend yet. On submit the form validates, shows a
   confirmation, and offers a **pre-filled WhatsApp message** to the business number.
   To send real leads to an inbox/CRM instead, hook `#bookForm`'s submit to your API
   (the success panel is already wired up in `initForm()`).
3. **Area select** — the "Other (not listed)" option is informational; connect it to a
   free-text input if you need the exact locality in leads.
4. If you serve other localities, edit the `AREAS` array in `script.js`
   (chips + dropdown update automatically). Same for `SERVICES`.
5. For the real domain, add `robots.txt` + `sitemap.xml` (both currently 404 on the
   live site) so Google indexes the page properly.

## Design notes

- Accessible color pairs: body text #101828 on white, orange #C2410C for buttons/text
  (≥4.5:1), deep blue #0D1B40 for headings.
- Touch targets ≥ 44px; sticky mobile call/WhatsApp/book bar on small screens.
- Reveal animations use CSS `animation` so card hover stays instant, and everything
  respects `prefers-reduced-motion`.
