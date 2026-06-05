# Sourav CV maker Pro - Luxury Executive CV Builder & ATS Optimizer

Welcome to **Sourav CV maker Pro**, a modern, lightweight, client-side web application designed to help executives, engineers, and professionals draft high-scoring, ATS-compatible resumes with a stunning digital layout and print-optimized PDF output.

---

## Key Features

- **Live Synchronization**: Edit details in the accordion form panel on the left and see changes immediately rendered on the right.
- **Dual Visual Modes**:
  - **👑 Luxury Digital Theme**: Features a velvet-charcoal background, metallic gold accents, and elegant classic headings. Perfect for screen reading, sharing as an online portfolio, or emailing directly to hiring managers.
  - **📄 ATS Print Mode**: A high-contrast, linear single-column layout using web-safe systems fonts (Garamond/Georgia/Arial). Stripped of screen-only icons, background graphics, and multi-column parsing structures that older ATS engines trip over.
- **Local Cache Auto-Save**: The editor caches inputs locally in your browser's storage, ensuring you don't lose progress if you accidentally reload or close the tab.
- **Data Portability (Import/Export JSON)**: Download your resume data as a `.json` backup file. You can load it back later to make updates, enabling you to maintain multiple copies (e.g., tailored for different jobs) easily.
- **Interactive Scaling (Zoom)**: Adjust the zoom controls (+ / -) in the preview toolbar to scale the A4 canvas to fit your screen size comfortably.
- **Print & Export to PDF**: Integrates print media stylesheets. When you click **Export ATS PDF**, it launches the system print dialog and formats the resume perfectly to A4 or Letter, outputting text vector PDFs that ATS software can easily read.

---

## Quick Start Guide

Since the application is built entirely using vanilla HTML5, CSS3, and JavaScript, it has **no dependencies** and requires **no installation**.

### Option 1: Direct Execution (Easiest)
1. Double-click the [index.html](file:///c:/Users/Sourav%20sanyal/OneDrive/Desktop/CV%20macer/index.html) file to open the application in any modern web browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local Web Server
If you prefer to run it using a local HTTP server:
- If you have Python installed, open terminal in this directory and run:
  ```bash
  python -m http.server 8000
  ```
  Then navigate to `http://localhost:8000` in your browser.
- Or use the Visual Studio Code **Live Server** extension.

---

## How to Export a Perfect ATS PDF

To ensure your exported PDF achieves maximum score when read by applicant tracking systems like Taleo, Greenhouse, Lever, or Workday:

1. Populate your resume details (or click **Load Executive Sample** to see a template).
2. Toggle the View Mode in the toolbar to **📄 ATS Print Mode**.
3. Click **Export ATS PDF** to open the system print dialog.
4. Set the print destination to **Save as PDF** or **Microsoft Print to PDF**.
5. **Important Print Settings:**
   - Under **Margins**, select **None** or **Default** (the CSS has built-in margins).
   - Under **Options**, check the box for **Background graphics** if you are exporting the Luxury style (though ATS Print Mode does not need them).
   - Clear any browser headers and footers (uncheck "Headers and footers") to keep pages clean of URLs and dates.
6. Click **Save**.

---

## Professional Writing & ATS Best Practices

To maximize your ATS ranking:

- **Action-Oriented Achievements**: Start every bullet point with a strong action verb (e.g., *Spearheaded, Orchestrated, Engineered, Pioneered, Optimized*). Avoid passive text like *"Responsible for..."* or *"Duties included..."*.
- **Quantifiable Results**: Include numbers, percentages, and dollar amounts (e.g., *"scaled organization from 30 to 80+ engineers"*, *"reduced infrastructure overhead by 32%"*, *"managed a capital budget of $12M"*).
- **Keyword Integration**: Match the exact terminology used in the job description you are applying to. For instance, if the description lists "SOC2 Compliance", include that exact phrase in your skills or experience.
- **Single-Column Rule**: Never use visual tables or multi-column grids for experience details. Many ATS scanners parse left-to-right, mixing sentences together. Sourav CV maker Pro's **ATS Print Mode** forces a strict linear hierarchy.
- **No Graphics**: Avoid inserting icons, charts, rating bars, or logos. They do not parse and can register as scrambled characters in candidate databases.
