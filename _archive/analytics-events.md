# Portfolio Analytics — Mixpanel Event Taxonomy

**Product:** Portfolio
**Source:** Frontend
**Last Updated:** 2026-02-11

---

## Naming Convention

```
Event Name = {action}_{element}_{module}_{screen}_{flow}_{product}
```

All values in **snake_case**.

---

## Screen Mapping

| Page File | Screen Name |
|-----------|-------------|
| index.html | home |
| work.html | work |
| about.html | about |
| contact.html | contact |
| case-study-1.html | ads_on_speaker |
| case-study-2.html | credit_line_upi |
| case-study-3.html | stolo_ux |
| case-study-4.html | bloc |

---

## 1. PAGE VIEWS (8 events)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 1 | Home | User lands on homepage | Frontend | portfolio | discovery | home | hero | page | view | `view_page_hero_home_discovery_portfolio` | referrer |
| 2 | Work | User lands on work page | Frontend | portfolio | discovery | work | page_hero | page | view | `view_page_page_hero_work_discovery_portfolio` | referrer |
| 3 | About | User lands on about page | Frontend | portfolio | about | about | page_hero | page | view | `view_page_page_hero_about_about_portfolio` | referrer |
| 4 | Contact | User lands on contact page | Frontend | portfolio | contact | contact | page_hero | page | view | `view_page_page_hero_contact_contact_portfolio` | referrer |
| 5 | Case Study 1 | User lands on Ads on Speaker | Frontend | portfolio | case_study | ads_on_speaker | cs_hero | page | view | `view_page_cs_hero_ads_on_speaker_case_study_portfolio` | referrer |
| 6 | Case Study 2 | User lands on Credit Line on UPI | Frontend | portfolio | case_study | credit_line_upi | cs_hero | page | view | `view_page_cs_hero_credit_line_upi_case_study_portfolio` | referrer |
| 7 | Case Study 3 | User lands on Stolo UX Research | Frontend | portfolio | case_study | stolo_ux | cs_hero | page | view | `view_page_cs_hero_stolo_ux_case_study_portfolio` | referrer |
| 8 | Case Study 4 | User lands on bloc | Frontend | portfolio | case_study | bloc | cs_hero | page | view | `view_page_cs_hero_bloc_case_study_portfolio` | referrer |

---

## 2. HEADER NAVIGATION (4 events — fire on all pages, screen is dynamic)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 9 | All | User clicks a header nav link (Home/Work/About/Contact) | Frontend | portfolio | navigation | {current_screen} | header_nav | link | tap | `tap_link_header_nav_{screen}_navigation_portfolio` | destination, link_text |
| 10 | All | User clicks Resume button in nav | Frontend | portfolio | navigation | {current_screen} | header_nav | button | tap | `tap_button_header_nav_{screen}_navigation_portfolio` | — |
| 11 | All | User clicks the yash. logo | Frontend | portfolio | navigation | {current_screen} | header_nav | logo | tap | `tap_logo_header_nav_{screen}_navigation_portfolio` | — |
| 12 | All | User toggles mobile hamburger menu | Frontend | portfolio | navigation | {current_screen} | header_nav | menu | toggle | `toggle_menu_header_nav_{screen}_navigation_portfolio` | state (open/close) |

---

## 3. FOOTER (2 events — fire on all pages, screen is dynamic)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 13 | All | User clicks LinkedIn in footer | Frontend | portfolio | navigation | {current_screen} | footer | link | tap | `tap_link_footer_{screen}_navigation_portfolio` | channel (linkedin), url |
| 14 | All | User clicks Email in footer | Frontend | portfolio | navigation | {current_screen} | footer | link | tap | `tap_link_footer_{screen}_navigation_portfolio` | channel (email), url |

---

## 4. HOME PAGE (7 events)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 15 | Home | User clicks "See what I've built" hero CTA | Frontend | portfolio | discovery | home | hero | button | tap | `tap_button_hero_home_discovery_portfolio` | cta_text, destination |
| 16 | Home | User clicks "More about me →" hero link | Frontend | portfolio | discovery | home | hero | link | tap | `tap_link_hero_home_discovery_portfolio` | cta_text, destination |
| 17 | Home | User clicks a work card to read case study | Frontend | portfolio | discovery | home | work_cards | card | tap | `tap_card_work_cards_home_discovery_portfolio` | case_study, company, metric |
| 18 | Home | User clicks "Live App →" on Splitwise side project | Frontend | portfolio | discovery | home | side_projects | link | tap | `tap_link_side_projects_home_discovery_portfolio` | project_name, url |
| 19 | Home | User clicks "More about me →" in about teaser | Frontend | portfolio | about | home | about_teaser | link | tap | `tap_link_about_teaser_home_about_portfolio` | — |
| 20 | Home | User clicks "Get in Touch" CTA | Frontend | portfolio | contact | home | cta_section | button | tap | `tap_button_cta_section_home_contact_portfolio` | cta_text (Get in Touch) |
| 21 | Home | User clicks "Download Resume" CTA | Frontend | portfolio | contact | home | cta_section | button | tap | `tap_button_cta_section_home_contact_portfolio` | cta_text (Download Resume) |

---

## 5. WORK PAGE (4 events)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 22 | Work | User clicks a case study card | Frontend | portfolio | discovery | work | work_cards | card | tap | `tap_card_work_cards_work_discovery_portfolio` | case_study, company, metric |
| 23 | Work | User clicks side project link | Frontend | portfolio | discovery | work | side_projects | link | tap | `tap_link_side_projects_work_discovery_portfolio` | project_name, url |
| 24 | Work | User clicks "Get in Touch" CTA | Frontend | portfolio | contact | work | cta_section | button | tap | `tap_button_cta_section_work_contact_portfolio` | cta_text |
| 25 | Work | User clicks "Download Resume" CTA | Frontend | portfolio | contact | work | cta_section | button | tap | `tap_button_cta_section_work_contact_portfolio` | cta_text |

---

## 6. ABOUT PAGE (1 event — page view covered in #3)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 26 | About | User clicks "Get in Touch" CTA | Frontend | portfolio | contact | about | cta_section | button | tap | `tap_button_cta_section_about_contact_portfolio` | cta_text |
| 27 | About | User clicks "Download Resume" CTA | Frontend | portfolio | contact | about | cta_section | button | tap | `tap_button_cta_section_about_contact_portfolio` | cta_text |

---

## 7. CONTACT PAGE (3 events)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 28 | Contact | User clicks a contact channel (email/linkedin/resume/location) | Frontend | portfolio | contact | contact | contact_channels | link | tap | `tap_link_contact_channels_contact_contact_portfolio` | channel, url |
| 29 | Contact | User focuses first form field (starts filling form) | Frontend | portfolio | contact | contact | contact_form | form | focus | `focus_form_contact_form_contact_contact_portfolio` | field |
| 30 | Contact | User submits contact form | Frontend | portfolio | contact | contact | contact_form | form | submit | `submit_form_contact_form_contact_contact_portfolio` | — |

---

## 8. CASE STUDY PAGES (5 events — screen is dynamic per case study)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 31 | CS 1-4 | User clicks "← All work" back link | Frontend | portfolio | case_study | {cs_screen} | cs_hero | link | tap | `tap_link_cs_hero_{screen}_case_study_portfolio` | — |
| 32 | CS 1-4 | User clicks Previous/Next case study nav | Frontend | portfolio | case_study | {cs_screen} | cs_nav | link | tap | `tap_link_cs_nav_{screen}_case_study_portfolio` | direction (previous/next), destination |
| 33 | CS 4 (bloc) | User clicks "Test Beta Version" hero CTA | Frontend | portfolio | case_study | bloc | cs_hero | button | tap | `tap_button_cs_hero_bloc_case_study_portfolio` | cta_text, url |
| 34 | CS 4 (bloc) | User clicks "Test Beta Version" callout CTA | Frontend | portfolio | case_study | bloc | cs_content | button | tap | `tap_button_cs_content_bloc_case_study_portfolio` | cta_text, url |

---

## 9. SCROLL & ENGAGEMENT (2 events — fire on all pages, screen is dynamic)

| # | Event Page | Event Description | Event Source | Product | Flow | Screen | Module | Element | Action | Event Name | Event Parameter |
|---|-----------|-------------------|-------------|---------|------|--------|--------|---------|--------|------------|-----------------|
| 35 | All | User scrolls to 25%/50%/75%/100% of page | Frontend | portfolio | engagement | {current_screen} | page_content | page | scroll | `scroll_page_page_content_{screen}_engagement_portfolio` | depth (25/50/75/100) |
| 36 | All | A content section scrolls into viewport | Frontend | portfolio | engagement | {current_screen} | {section_module} | section | view | `view_section_{module}_{screen}_engagement_portfolio` | section_name |

---

## Total: 36 event definitions (some with dynamic screen names)

### Events by flow:
- **Navigation:** 6 (header nav, footer)
- **Discovery:** 9 (page views, work cards, side projects, hero CTAs)
- **Case Study:** 12 (page views, back links, nav, TestFlight CTAs)
- **Contact:** 7 (page view, channels, form, CTA buttons)
- **About:** 3 (page view, CTA buttons)
- **Engagement:** 2 (scroll depth, section views)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-11 | Initial event taxonomy — 36 events across 8 pages |
