/* ==========================================================================
   Luxury Executive Resume Builder - Application Logic
   ========================================================================== */

// 1. Central Application State
let resumeData = {
    fullname: "",
    jobtitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "", // GitHub link
    website: "",
    summary: "",
    photo: "", // Base64 profile picture string
    photoAlign: "right", // position: left or right
    workExperience: [],
    education: [],
    projects: [],
    skills: "", // Comma-separated skills list
    certifications: [],
    languages: []
};

// 2. High-Caliber Executive Sample Data
const sampleData = {
    fullname: "Sourav sanyal Joy",
    jobtitle: "Flutter App Developer",
    email: "joysanyal1999@gmail.com",
    phone: "+8801307460389",
    location: "Gazipur cadet College Residential Area, Gazipur",
    linkedin: "linkedin.com/in/sourav-sanyal-joy/",
    github: "github.com/Souravsanyal1",
    website: "",
    summary: "Dedicated and detail-oriented Flutter App Developer with experience building high-performance, cross-platform mobile applications. Skilled in Dart, Flutter SDK, state management (Provider/Bloc), API integration, and modern UI/UX design. Passionate about writing clean, maintainable code, optimizing app performance, and delivering seamless user experiences across iOS and Android platforms.",
    photo: "",
    photoAlign: "right",
    workExperience: [
        {
            company: "Freelance / Independent Software Developer",
            title: "Flutter App Developer",
            location: "Gazipur, Bangladesh",
            startDate: "Jan 2022",
            endDate: "Present",
            details: "Developed and published custom Flutter applications on Google Play Store and iOS App Store, ensuring compatibility across multiple screen sizes and OS versions.\nImplemented state management patterns (Bloc, Provider) to optimize application state, decreasing UI rendering overhead by 25%.\nIntegrated RESTful APIs, Firebase services (Authentication, Firestore, Cloud Messaging), and local databases (Hive, SQLite) to enable robust offline functionality.\nCollaborated with UI/UX designers to implement pixel-perfect, responsive layouts and animations, enhancing overall user engagement scores."
        }
    ],
    education: [
        {
            degree: "Bachelor of Science",
            school: "Bangladesh Open University",
            location: "Gazipur, Bangladesh",
            gradYear: "Running",
            details: "Currently pursuing degree studies with a focus on computing and software development."
        }
    ],
    projects: [
        {
            name: "multi-system-app",
            role: "Lead Developer",
            link: "github.com/Souravsanyal1/multi-system-app",
            description: "Developed a comprehensive multi-system mobile application using Flutter. Led the full development lifecycle, including system architecture, UI/UX implementation, API integration, and performance optimization. Implemented multiple modules within a single platform, ensuring scalability, maintainability, and a seamless user experience. Collaborated on feature planning, debugging, testing, and deployment while following modern mobile development best practices."
        }
    ],
    skills: "Flutter, Dart, Mobile App Development, iOS & Android Development, State Management (Provider, Bloc, GetX), RESTful APIs, Firebase Integration, Git, UI/UX Implementation, API Integration, SQLite, Hive Database, Play Store Publishing, App Performance Optimization",
    certifications: [
        {
            name: "Mobile App Development with Flutter",
            issuer: "Online Learning Platform",
            date: "2023"
        }
    ],
    languages: [
        {
            language: "Bangla",
            proficiency: "Native"
        },
        {
            language: "English",
            proficiency: "Conversational"
        }
    ]
};

// 3. Zoom Factor State
let zoomFactor = 1.0;

// ==========================================================================
// Initialization and Event Setup
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initAccordions();
    initZoomControls();
    initThemeSwitcher();
    initActionButtons();
    initFormBindings();
    
    // Load existing data from LocalStorage or seed with sample data
    const savedData = localStorage.getItem("aureum_resume_data");
    if (savedData) {
        try {
            resumeData = JSON.parse(savedData);
            
            // Automatically upgrade placeholder data to the user's details if the name is Edward
            if (resumeData.fullname === "Edward V. Sterling") {
                resumeData = JSON.parse(JSON.stringify(sampleData));
                localStorage.setItem("aureum_resume_data", JSON.stringify(resumeData));
            } else {
                // Migration: Convert old object skills schema to flat string if needed
                if (resumeData.skills && typeof resumeData.skills === "object") {
                    const parts = [];
                    if (resumeData.skills.core) parts.push(resumeData.skills.core);
                    if (resumeData.skills.tech) parts.push(resumeData.skills.tech);
                    if (resumeData.skills.soft) parts.push(resumeData.skills.soft);
                    resumeData.skills = parts.join(", ");
                }
            }
            
            populateForm();
            renderPreview();
        } catch (e) {
            console.error("Error parsing saved local storage data:", e);
            loadSampleData();
        }
    } else {
        // Auto-seed on first visit so the layout isn't blank
        loadSampleData();
    }
});

// Accordion Collapsible Logic (Standard Single-Open Behavior)
function initAccordions() {
    const triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            const currentItem = e.currentTarget.parentElement;
            const isOpen = currentItem.classList.contains("active");
            
            // Close all items
            document.querySelectorAll(".accordion-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
            });
            
            // Toggle current
            if (!isOpen) {
                currentItem.classList.add("active");
                e.currentTarget.setAttribute("aria-expanded", "true");
                
                // Smooth scroll editor to top of selected section (useful on long forms)
                setTimeout(() => {
                    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

// Zoom Viewport Controls
function initZoomControls() {
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    const zoomValSpan = document.getElementById("zoom-value");
    const canvas = document.getElementById("resume-canvas");

    const updateZoom = () => {
        zoomValSpan.textContent = `${Math.round(zoomFactor * 100)}%`;
        canvas.style.transform = `scale(${zoomFactor})`;
        
        // Adjust the viewport height/margins to accommodate scaling
        const scaledHeight = canvas.offsetHeight * zoomFactor;
        const viewport = document.querySelector(".canvas-viewport");
        
        // Keep a minimum height equivalent to A4 layout scale
        viewport.style.minHeight = `${scaledHeight + 80}px`;
    };

    zoomInBtn.addEventListener("click", () => {
        if (zoomFactor < 1.5) {
            zoomFactor += 0.1;
            updateZoom();
        }
    });

    zoomOutBtn.addEventListener("click", () => {
        if (zoomFactor > 0.5) {
            zoomFactor -= 0.1;
            updateZoom();
        }
    });
    
    // Quick recalculation when window resizes
    window.addEventListener("resize", updateZoom);
}

// Theme Template Toggle
function initThemeSwitcher() {
    const btnLuxury = document.getElementById("theme-luxury");
    const btnAts = document.getElementById("theme-ats");
    const canvas = document.getElementById("resume-canvas");

    btnLuxury.addEventListener("click", () => {
        btnLuxury.classList.add("active");
        btnAts.classList.remove("active");
        canvas.className = "resume-paper theme-luxury-dark";
        renderPreview(); // Instantly update link texts to short buttons
    });

    btnAts.addEventListener("click", () => {
        btnAts.classList.add("active");
        btnLuxury.classList.remove("active");
        canvas.className = "resume-paper theme-ats-light";
        renderPreview(); // Instantly update link texts to actual URLs
    });
}

// Global Toolbar Commands
function initActionButtons() {
    // Preset Loader
    document.getElementById("btn-load-sample").addEventListener("click", () => {
        if (confirm("This will overwrite your current inputs. Load executive sample data?")) {
            loadSampleData();
        }
    });

    // Clear Screen
    document.getElementById("btn-clear").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all resume fields?")) {
            clearAllData();
        }
    });

    // Save JSON file
    document.getElementById("btn-export-json").addEventListener("click", () => {
        exportToJSONFile();
    });

    // Import Trigger
    const fileInput = document.getElementById("import-file-input");
    document.getElementById("btn-import-trigger").addEventListener("click", () => {
        fileInput.click();
    });
    
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            importFromJSONFile(file);
        }
    });

    // System Print (triggers PDF export)
    document.getElementById("btn-print").addEventListener("click", () => {
        window.print();
    });
}

// ==========================================================================
// Form Data Bindings & Event Syncing
// ==========================================================================
function initFormBindings() {
    // Simple Static Text Fields
    const textBindings = [
        { id: "input-fullname", key: "fullname" },
        { id: "input-jobtitle", key: "jobtitle" },
        { id: "input-email", key: "email" },
        { id: "input-phone", key: "phone" },
        { id: "input-location", key: "location" },
        { id: "input-linkedin", key: "linkedin" },
        { id: "input-github", key: "github" },
        { id: "input-website", key: "website" },
        { id: "input-summary", key: "summary" }
    ];

    textBindings.forEach(binding => {
        const el = document.getElementById(binding.id);
        el.addEventListener("input", (e) => {
            resumeData[binding.key] = e.target.value;
            syncState();
        });
    });

    // Photo Upload Bindings
    const photoInput = document.getElementById("input-photo");
    const photoAlignSelect = document.getElementById("input-photo-align");
    const removePhotoBtn = document.getElementById("btn-remove-photo");

    photoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                resumeData.photo = event.target.result;
                document.getElementById("photo-form-preview").src = event.target.result;
                document.getElementById("photo-preview-container").style.display = "flex";
                syncState();
            };
            reader.readAsDataURL(file);
        }
    });

    photoAlignSelect.addEventListener("change", (e) => {
        resumeData.photoAlign = e.target.value;
        syncState();
    });

    removePhotoBtn.addEventListener("click", () => {
        resumeData.photo = "";
        photoInput.value = "";
        document.getElementById("photo-preview-container").style.display = "none";
        document.getElementById("photo-form-preview").src = "";
        syncState();
    });

    // Skills Binding
    const skillsInput = document.getElementById("input-skills-all");
    skillsInput.addEventListener("input", (e) => {
        resumeData.skills = e.target.value;
        syncState();
    });

    // Summary Templates Binding
    const templateButtons = document.querySelectorAll(".btn-template");
    const summaryTextarea = document.getElementById("input-summary");
    
    const templates = {
        exec: "Visionary and results-driven Executive Leader with over 15 years of leadership experience spearheading strategic operations, scaling high-performing teams, and driving revenue growth. Proven track record of optimizing operations, managing multi-million dollar budgets, and leading digital transformation.",
        tech: "Highly skilled Technical Professional with over 5 years of experience designing, building, and deploying scalable software solutions. Proficient in modern programming frameworks, cloud architecture, and database management. Passionate about system optimization and implementing engineering best practices.",
        gen: "Highly motivated and detail-oriented graduate with a strong academic foundation and practical project experience. Skilled in data analysis, problem-solving, and cross-functional communication. Eager to contribute to team success, learn new technologies, and drive business results."
    };

    templateButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const templateType = btn.getAttribute("data-template");
            if (templates[templateType]) {
                if (!summaryTextarea.value.trim() || confirm("This will overwrite your current summary. Proceed?")) {
                    resumeData.summary = templates[templateType];
                    summaryTextarea.value = templates[templateType];
                    syncState();
                }
            }
        });
    });

    // Dynamic Lists Creation Triggers
    document.getElementById("btn-add-experience").addEventListener("click", () => {
        resumeData.workExperience.push({ company: "", title: "", location: "", startDate: "", endDate: "", details: "" });
        renderDynamicListEditors("experience");
        syncState();
    });

    document.getElementById("btn-add-education").addEventListener("click", () => {
        resumeData.education.push({ degree: "", school: "", location: "", gradYear: "", details: "" });
        renderDynamicListEditors("education");
        syncState();
    });

    document.getElementById("btn-add-project").addEventListener("click", () => {
        resumeData.projects.push({ name: "", role: "", link: "", description: "" });
        renderDynamicListEditors("projects");
        syncState();
    });

    document.getElementById("btn-add-certification").addEventListener("click", () => {
        resumeData.certifications.push({ name: "", issuer: "", date: "" });
        renderDynamicListEditors("certifications");
        syncState();
    });

    document.getElementById("btn-add-language").addEventListener("click", () => {
        resumeData.languages.push({ language: "", proficiency: "" });
        renderDynamicListEditors("languages");
        syncState();
    });
}

// Update LocalStorage and render live preview on changes
function syncState() {
    localStorage.setItem("aureum_resume_data", JSON.stringify(resumeData));
    renderPreview();
}

// Clear all inputs
function clearAllData() {
    resumeData = {
        fullname: "",
        jobtitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
        summary: "",
        photo: "",
        photoAlign: "right",
        workExperience: [],
        education: [],
        projects: [],
        skills: "",
        certifications: [],
        languages: []
    };
    
    // Clear photo file selector input in UI
    document.getElementById("input-photo").value = "";
    
    populateForm();
    syncState();
}

// Seed the preset data
function loadSampleData() {
    resumeData = JSON.parse(JSON.stringify(sampleData)); // Deep clone
    populateForm();
    syncState();
}

// Fill out all inputs based on resumeData state
function populateForm() {
    // Fill static text inputs
    document.getElementById("input-fullname").value = resumeData.fullname || "";
    document.getElementById("input-jobtitle").value = resumeData.jobtitle || "";
    document.getElementById("input-email").value = resumeData.email || "";
    document.getElementById("input-phone").value = resumeData.phone || "";
    document.getElementById("input-location").value = resumeData.location || "";
    document.getElementById("input-linkedin").value = resumeData.linkedin || "";
    document.getElementById("input-github").value = resumeData.github || "";
    document.getElementById("input-website").value = resumeData.website || "";
    document.getElementById("input-summary").value = resumeData.summary || "";
    
    // Fill photo settings
    const photoPreviewContainer = document.getElementById("photo-preview-container");
    const photoFormPreview = document.getElementById("photo-form-preview");
    const photoAlignSelect = document.getElementById("input-photo-align");
    const photoInput = document.getElementById("input-photo");
    
    if (resumeData.photo) {
        photoFormPreview.src = resumeData.photo;
        photoPreviewContainer.style.display = "flex";
    } else {
        photoFormPreview.src = "";
        photoPreviewContainer.style.display = "none";
        photoInput.value = "";
    }
    
    photoAlignSelect.value = resumeData.photoAlign || "right";

    // Fill skills
    document.getElementById("input-skills-all").value = resumeData.skills || "";

    // Build the dynamic list DOM structures in the editor
    renderDynamicListEditors("experience");
    renderDynamicListEditors("education");
    renderDynamicListEditors("projects");
    renderDynamicListEditors("certifications");
    renderDynamicListEditors("languages");
}

// ==========================================================================
// Dynamic List Renderer (Form Editor Panel)
// ==========================================================================
function renderDynamicListEditors(listKey) {
    let container, listData;
    
    switch(listKey) {
        case "experience":
            container = document.getElementById("experience-list");
            listData = resumeData.workExperience;
            break;
        case "education":
            container = document.getElementById("education-list");
            listData = resumeData.education;
            break;
        case "projects":
            container = document.getElementById("projects-list");
            listData = resumeData.projects;
            break;
        case "certifications":
            container = document.getElementById("certifications-list");
            listData = resumeData.certifications;
            break;
        case "languages":
            container = document.getElementById("languages-list");
            listData = resumeData.languages;
            break;
    }
    
    if (!container) return;
    container.innerHTML = "";

    listData.forEach((item, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "dynamic-item";
        
        let itemHeaderHtml = `
            <div class="dynamic-item-header">
                <span class="dynamic-item-title">${listKey} #${index + 1}</span>
                <button type="button" class="btn btn-remove" data-action="remove" data-index="${index}">Delete</button>
            </div>
        `;

        let formHtml = "";
        
        if (listKey === "experience") {
            formHtml = `
                <div class="form-grid" style="padding-top:0;">
                    <div class="form-group col-span-2">
                        <label>Company / Organization Name</label>
                        <input type="text" data-field="company" value="${item.company || ''}">
                    </div>
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" data-field="title" value="${item.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" data-field="location" value="${item.location || ''}">
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" data-field="startDate" placeholder="E.g. Jun 2018" value="${item.startDate || ''}">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" data-field="endDate" placeholder="E.g. Present" value="${item.endDate || ''}">
                    </div>
                    <div class="form-group col-span-2">
                        <label>Key Accomplishments & Bullet Points</label>
                        <span class="input-hint">Write each bullet point on a new line. Focus on metrics, quantitative values, and strong action verbs (Led, Engineered, Optimized).</span>
                        <textarea rows="4" data-field="details" placeholder="E.g. Spearheaded engineering team of 10 to launch product X.\nOptimized system latency, resulting in a 24% boost in customer retention.">${item.details || ''}</textarea>
                    </div>
                </div>
            `;
        } else if (listKey === "education") {
            formHtml = `
                <div class="form-grid" style="padding-top:0;">
                    <div class="form-group col-span-2">
                        <label>Degree & Major</label>
                        <input type="text" data-field="degree" placeholder="E.g. M.S. in Computer Science" value="${item.degree || ''}">
                    </div>
                    <div class="form-group">
                        <label>School / University Name</label>
                        <input type="text" data-field="school" value="${item.school || ''}">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" data-field="location" value="${item.location || ''}">
                    </div>
                    <div class="form-group">
                        <label>Graduation Year / Status</label>
                        <input type="text" data-field="gradYear" placeholder="E.g. Running, Ongoing, or 2022 - 2026" value="${item.gradYear || ''}">
                    </div>
                    <div class="form-group">
                        <label>Details / GPA / Honors (Optional)</label>
                        <input type="text" data-field="details" placeholder="E.g. Magna Cum Laude, GPA 3.9" value="${item.details || ''}">
                    </div>
                </div>
            `;
        } else if (listKey === "projects") {
            formHtml = `
                <div class="form-grid" style="padding-top:0;">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" data-field="name" value="${item.name || ''}">
                    </div>
                    <div class="form-group">
                        <label>Your Role / Contribution</label>
                        <input type="text" data-field="role" placeholder="E.g. Lead Developer, System Architect" value="${item.role || ''}">
                    </div>
                    <div class="form-group col-span-2">
                        <label>Project URL / Reference Link (Optional)</label>
                        <input type="text" data-field="link" placeholder="E.g. github.com/myproject" value="${item.link || ''}">
                    </div>
                    <div class="form-group col-span-2">
                        <label>Project Details / Key Accomplishments</label>
                        <textarea rows="3" data-field="description" placeholder="E.g. Developed and published an open-source tool X which gained 2.4k stars.">${item.description || ''}</textarea>
                    </div>
                </div>
            `;
        } else if (listKey === "certifications") {
            formHtml = `
                <div class="form-grid" style="padding-top:0;">
                    <div class="form-group col-span-2">
                        <label>Certification / Qualification (Title & Issuing Board)</label>
                        <input type="text" data-field="name" placeholder="E.g. HSC - Higher Secondary Certificate (Dhaka Board) or AWS Cloud Practitioner" value="${item.name || ''}">
                    </div>
                    <div class="form-group col-span-2">
                        <label>Year / Date</label>
                        <input type="text" data-field="date" placeholder="E.g. 2018" value="${item.date || ''}">
                    </div>
                </div>
            `;
        } else if (listKey === "languages") {
            const proficiencies = [
                "Native / Bilingual",
                "Full Professional",
                "Professional Working",
                "Limited Working",
                "Elementary"
            ];
            let optionsHtml = `<option value="" disabled ${!item.proficiency ? 'selected' : ''}>Select Proficiency</option>`;
            
            let isCustom = item.proficiency && !proficiencies.includes(item.proficiency);
            if (isCustom) {
                optionsHtml += `<option value="${escapeHTML(item.proficiency)}" selected>${escapeHTML(item.proficiency)}</option>`;
            }
            
            proficiencies.forEach(prof => {
                optionsHtml += `<option value="${prof}" ${item.proficiency === prof ? 'selected' : ''}>${prof}</option>`;
            });

            formHtml = `
                <div class="form-grid" style="padding-top:0;">
                    <div class="form-group">
                        <label>Language</label>
                        <input type="text" data-field="language" placeholder="E.g. Bengali, English" value="${item.language || ''}">
                    </div>
                    <div class="form-group">
                        <label>Proficiency</label>
                        <select data-field="proficiency">
                            ${optionsHtml}
                        </select>
                    </div>
                </div>
            `;
        }
        
        itemEl.innerHTML = itemHeaderHtml + formHtml;
        container.appendChild(itemEl);

        // Bind delete event
        itemEl.querySelector('button[data-action="remove"]').addEventListener("click", () => {
            listData.splice(index, 1);
            renderDynamicListEditors(listKey);
            syncState();
        });

        // Bind child input events to update this specific index in the state
        itemEl.querySelectorAll("input, select, textarea").forEach(el => {
            const field = el.getAttribute("data-field");
            const eventName = el.tagName.toLowerCase() === "select" ? "change" : "input";
            el.addEventListener(eventName, (e) => {
                item[field] = e.target.value;
                syncState();
            });
        });
    });
}

// ==========================================================================
// Resume Renderer (Generates Live Visual/ATS HTML)
// ==========================================================================
function renderPreview() {
    const canvas = document.getElementById("resume-canvas");
    if (!canvas) return;

    const isAtsTheme = canvas.classList.contains("theme-ats-light");

    // Contact Information formatting (helper)
    let contactHTML = "";
    if (resumeData.email && resumeData.email.trim()) {
        contactHTML += `<a href="mailto:${resumeData.email.trim()}" class="resume-contact-item">${resumeData.email.trim()}</a>`;
    }
    if (resumeData.phone && resumeData.phone.trim()) {
        contactHTML += `<div class="resume-contact-item"><span>${resumeData.phone.trim()}</span></div>`;
    }
    if (resumeData.location && resumeData.location.trim()) {
        contactHTML += `<div class="resume-contact-item"><span>${resumeData.location.trim()}</span></div>`;
    }
    if (resumeData.linkedin && resumeData.linkedin.trim()) {
        const cleanLinkedin = resumeData.linkedin.trim().replace(/^(https?:\/\/)?(www\.)?/, "");
        const displayText = isAtsTheme ? cleanLinkedin : "LinkedIn";
        contactHTML += `<a href="https://${cleanLinkedin}" target="_blank" class="resume-contact-item contact-blue">${displayText}</a>`;
    }
    if (resumeData.github && resumeData.github.trim()) {
        const cleanGithub = resumeData.github.trim().replace(/^(https?:\/\/)?(www\.)?/, "");
        const displayText = isAtsTheme ? cleanGithub : "GitHub";
        contactHTML += `<a href="https://${cleanGithub}" target="_blank" class="resume-contact-item contact-blue">${displayText}</a>`;
    }
    if (resumeData.website && resumeData.website.trim()) {
        const cleanWeb = resumeData.website.trim().replace(/^(https?:\/\/)?(www\.)?/, "");
        const displayText = isAtsTheme ? cleanWeb : "Portfolio";
        contactHTML += `<a href="https://${cleanWeb}" target="_blank" class="resume-contact-item">${displayText}</a>`;
    }

    // Professional Summary Section
    let summaryHTML = "";
    if (resumeData.summary) {
        summaryHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Professional Summary</h3>
                <p class="resume-summary">${escapeHTML(resumeData.summary)}</p>
            </section>
        `;
    }

    // Work Experience Section
    let experienceHTML = "";
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
        let itemsHTML = "";
        resumeData.workExperience.forEach(job => {
            // Parse bullet points from text lines
            let detailsHTML = "";
            if (job.details) {
                const lines = job.details.split("\n").map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length > 0) {
                    detailsHTML = `<ul class="resume-item-details">`;
                    lines.forEach(line => {
                        // Strip leading hyphens or bullet characters if input has them
                        const cleanedLine = line.replace(/^[-•*]\s*/, "");
                        detailsHTML += `<li>${escapeHTML(cleanedLine)}</li>`;
                    });
                    detailsHTML += `</ul>`;
                }
            }

            itemsHTML += `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title-row">
                            <span class="resume-item-title">${escapeHTML(job.title || "Job Title")}</span>
                            <span class="resume-item-org">${escapeHTML(job.company || "Company")}</span>
                        </div>
                        <div class="resume-item-meta">
                            <span class="resume-item-date">${escapeHTML(job.startDate || "")} – ${escapeHTML(job.endDate || "")}</span>
                            <span class="resume-item-loc">${escapeHTML(job.location || "")}</span>
                        </div>
                    </div>
                    ${detailsHTML}
                </div>
            `;
        });

        experienceHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Work Experience</h3>
                ${itemsHTML}
            </section>
        `;
    }

    // Skills Section
    let skillsHTML = "";
    if (resumeData.skills) {
        const skillList = resumeData.skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
        if (skillList.length > 0) {
            let tagsHTML = "";
            skillList.forEach(skill => {
                tagsHTML += `<span class="skill-tag">${escapeHTML(skill)}</span>`;
            });
            
            skillsHTML = `
                <section class="resume-section">
                    <h3 class="resume-section-title">Core Competencies & Skills</h3>
                    <div class="resume-skills-container">
                        ${tagsHTML}
                    </div>
                </section>
            `;
        }
    }

    // Projects Section
    let projectsHTML = "";
    if (resumeData.projects && resumeData.projects.length > 0) {
        let itemsHTML = "";
        resumeData.projects.forEach(project => {
            let roleLinkHTML = "";
            if (project.role || project.link) {
                const parts = [];
                if (project.role) parts.push(project.role);
                if (project.link) {
                    const cleanLink = project.link.replace(/^(https?:\/\/)?(www\.)?/, "");
                    const linkText = cleanLink.toLowerCase().includes("github.com") ? "GitHub" : "Project Link";
                    parts.push(`<a href="https://${cleanLink}" target="_blank">${linkText}</a>`);
                }
                roleLinkHTML = `<span class="resume-item-org">${parts.join(" | ")}</span>`;
            }

            itemsHTML += `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title-row">
                            <span class="resume-item-title">${escapeHTML(project.name || "Project Name")}</span>
                            ${roleLinkHTML}
                        </div>
                    </div>
                    ${project.description ? `<p class="resume-item-details" style="margin-left:0; margin-top:0.25rem;">${escapeHTML(project.description)}</p>` : ""}
                </div>
            `;
        });

        projectsHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Key Projects</h3>
                ${itemsHTML}
            </section>
        `;
    }

    // Education Section
    let educationHTML = "";
    if (resumeData.education && resumeData.education.length > 0) {
        let itemsHTML = "";
        resumeData.education.forEach(edu => {
            let eduDetails = "";
            if (edu.details) {
                eduDetails = `<p class="resume-item-details" style="margin-left:0; margin-top:0.2rem;">${escapeHTML(edu.details)}</p>`;
            }

            itemsHTML += `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title-row">
                            <span class="resume-item-title">${escapeHTML(edu.degree || "Degree")}</span>
                            <span class="resume-item-org">${escapeHTML(edu.school || "School / University")}</span>
                        </div>
                        <div class="resume-item-meta">
                            <span class="resume-item-date">${escapeHTML(edu.gradYear || "")}</span>
                            <span class="resume-item-loc">${escapeHTML(edu.location || "")}</span>
                        </div>
                    </div>
                    ${eduDetails}
                </div>
            `;
        });

        educationHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Education</h3>
                ${itemsHTML}
            </section>
        `;
    }

    // Grid details for Certifications & Languages
    let certsHTML = "";
    if (resumeData.certifications && resumeData.certifications.length > 0) {
        let itemsHTML = "";
        resumeData.certifications.forEach(cert => {
            const metaParts = [];
            if (cert.issuer) metaParts.push(cert.issuer);
            if (cert.date) metaParts.push(`(${cert.date})`);
            const metaText = metaParts.join(" ");

            itemsHTML += `
                <div class="resume-compact-item">
                    <span class="resume-compact-name">${escapeHTML(cert.name || "Certification Title")}</span>
                    <span class="resume-compact-meta">${escapeHTML(metaText)}</span>
                </div>
            `;
        });
        certsHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Certifications</h3>
                ${itemsHTML}
            </section>
        `;
    }

    let languagesHTML = "";
    if (resumeData.languages && resumeData.languages.length > 0) {
        let itemsHTML = "";
        resumeData.languages.forEach(lang => {
            itemsHTML += `
                <div class="resume-compact-item">
                    <span class="resume-compact-name">${escapeHTML(lang.language || "Language")}</span>
                    <span class="resume-compact-meta">${escapeHTML(lang.proficiency || "")}</span>
                </div>
            `;
        });
        languagesHTML = `
            <section class="resume-section">
                <h3 class="resume-section-title">Languages</h3>
                ${itemsHTML}
            </section>
        `;
    }

    // Combine bottom sections (Certifications and Languages) in a 2-column grid if they exist
    let extraGridHTML = "";
    if (certsHTML || languagesHTML) {
        extraGridHTML = `
            <div class="resume-grid-2col">
                ${certsHTML}
                ${languagesHTML}
            </div>
        `;
    }

    // Header Photo formatting
    let headerHTML = "";
    if (resumeData.photo) {
        headerHTML = `
            <div class="resume-header has-photo align-${resumeData.photoAlign || 'right'}">
                <div class="resume-header-info">
                    <h2 class="resume-name">${escapeHTML(resumeData.fullname || "Your Name")}</h2>
                    <div class="resume-title">${escapeHTML(resumeData.jobtitle || "Your Professional Title")}</div>
                    <div class="resume-contact">
                        ${contactHTML}
                    </div>
                </div>
                <img src="${resumeData.photo}" class="resume-photo" alt="Profile Photo">
            </div>
        `;
    } else {
        headerHTML = `
            <div class="resume-header">
                <h2 class="resume-name">${escapeHTML(resumeData.fullname || "Your Name")}</h2>
                <div class="resume-title">${escapeHTML(resumeData.jobtitle || "Your Professional Title")}</div>
                <div class="resume-contact">
                    ${contactHTML}
                </div>
            </div>
        `;
    }

    // Build the final complete HTML
    canvas.innerHTML = `
        ${headerHTML}
        ${summaryHTML}
        ${experienceHTML}
        ${skillsHTML}
        ${projectsHTML}
        ${educationHTML}
        ${extraGridHTML}
    `;
    
    // Auto-adjust scale sizing rules on update
    const scaledHeight = canvas.offsetHeight * zoomFactor;
    document.querySelector(".canvas-viewport").style.minHeight = `${scaledHeight + 80}px`;
}

// Helper to escape HTML tags to avoid XSS inject vulnerabilities
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================================================
// JSON Import & Export Functionality
// ==========================================================================
function exportToJSONFile() {
    const jsonString = JSON.stringify(resumeData, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const nameSlug = resumeData.fullname ? resumeData.fullname.toLowerCase().replace(/\s+/g, "_") : "resume";
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `${nameSlug}_sourav_cv_maker_pro_data.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
}

function importFromJSONFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsedData = JSON.parse(e.target.result);
            
            // Simple validation of schema keys
            if (parsedData.fullname !== undefined) {
                resumeData = parsedData;
                populateForm();
                syncState();
                alert("Data imported successfully!");
            } else {
                throw new Error("Missing required root keys.");
            }
        } catch (err) {
            alert("Failed to parse the JSON file. Please make sure the format is valid.");
            console.error("JSON parse failure:", err);
        }
    };
    reader.readAsText(file);
}
