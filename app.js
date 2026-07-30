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
    initMobileTabs();
    
    // Load existing data from LocalStorage
    const savedData = localStorage.getItem("aureum_resume_data");
    if (savedData) {
        try {
            resumeData = JSON.parse(savedData);
            
            // If the saved data has the default sample name, clear it to start fresh
            if (resumeData.fullname === "Edward V. Sterling" || resumeData.fullname === "Sourav sanyal Joy") {
                clearAllData();
            } else {
                // Migration: Convert old object skills schema to flat string if needed
                if (resumeData.skills && typeof resumeData.skills === "object") {
                    const parts = [];
                    if (resumeData.skills.core) parts.push(resumeData.skills.core);
                    if (resumeData.skills.tech) parts.push(resumeData.skills.tech);
                    if (resumeData.skills.soft) parts.push(resumeData.skills.soft);
                    resumeData.skills = parts.join(", ");
                }
                populateForm();
                renderPreview();
            }
        } catch (e) {
            console.error("Error parsing saved local storage data:", e);
            clearAllData();
        }
    } else {
        // Start completely empty on first visit
        clearAllData();
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

// Zoom Viewport Controls with Auto-Scaling for Mobile
function initZoomControls() {
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    const zoomValSpan = document.getElementById("zoom-value");
    const canvas = document.getElementById("resume-canvas");

    const updateZoom = () => {
        const viewport = document.querySelector(".canvas-viewport");
        if (!viewport || !canvas) return;

        let activeScale = zoomFactor;
        if (window.innerWidth <= 768) {
            // Auto scale to fit the Android/mobile screen width cleanly
            const viewportWidth = viewport.clientWidth || window.innerWidth;
            const canvasWidth = canvas.offsetWidth || 794;
            activeScale = Math.min(zoomFactor, (viewportWidth - 16) / canvasWidth);
        }

        zoomValSpan.textContent = `${Math.round(activeScale * 100)}%`;
        canvas.style.transform = `scale(${activeScale})`;
        canvas.style.transformOrigin = "top center";
        
        // Calculate vertical scale height difference to eliminate dead bottom space and allow smooth end-to-end scrolling
        const unscaledHeight = canvas.offsetHeight;
        const scaledHeight = unscaledHeight * activeScale;
        const heightDiff = unscaledHeight - scaledHeight;
        
        canvas.style.marginBottom = `-${heightDiff - 30}px`;
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

    window.addEventListener("beforeprint", () => {
        const workspace = document.querySelector(".app-workspace");
        if (workspace) {
            workspace.classList.remove("tab-editor");
            workspace.classList.add("tab-preview");
        }
        const canvas = document.getElementById("resume-canvas");
        if (canvas) {
            canvas.style.transform = "none";
        }
    });

    window.addEventListener("afterprint", () => {
        window.dispatchEvent(new Event("resize"));
    });

    // ATS Score Analyzer
    document.getElementById("btn-ats-score").addEventListener("click", () => {
        openATSAnalyzer();
    });

    // ATS Modal Close
    document.getElementById("ats-modal-close").addEventListener("click", closeATSModal);
    document.getElementById("ats-modal-overlay").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeATSModal();
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
            // Validate file type
            if (!file.type.match("image.*")) {
                alert("Please upload a valid image file (e.g., PNG, JPG, JPEG).");
                photoInput.value = "";
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    resumeData.photo = event.target.result;
                    document.getElementById("photo-form-preview").src = event.target.result;
                    document.getElementById("photo-preview-container").style.display = "flex";
                    syncState();
                } catch (error) {
                    console.error("Error processing photo:", error);
                    alert("Failed to process the photo. Please try again.");
                    photoInput.value = "";
                }
            };
            reader.onerror = () => {
                console.error("Error reading file:", reader.error);
                alert("Failed to read the photo. Please try again.");
                photoInput.value = "";
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
        <div class="resume-content-wrapper">
            ${headerHTML}
            ${summaryHTML}
            ${experienceHTML}
            ${skillsHTML}
            ${projectsHTML}
            ${educationHTML}
            ${extraGridHTML}
        </div>
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

// Force the resume to fit on one A4 page
function adjustPrintScale() {
    const canvas = document.getElementById("resume-canvas");
    if (!canvas) return;
    const wrapper = canvas.querySelector(".resume-content-wrapper");
    if (!wrapper) return;

    // Reset styles before measuring
    wrapper.style.transform = "none";
    wrapper.style.width = "100%";
    
    // Measure the natural height of the content
    const contentHeight = wrapper.scrollHeight;
    
    // Target height for A4 page (264mm with 3mm safety margin)
    const targetHeightPx = 264 * 3.779527559; // ~997.8px
    
    // Force scaling to fit the content on one page
    if (contentHeight > targetHeightPx) {
        const scale = targetHeightPx / contentHeight;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = "top left";
        wrapper.style.width = `${100 / scale}%`;
    }
}

// Force ATS theme and scaling during print
window.addEventListener("beforeprint", () => {
    const canvas = document.getElementById("resume-canvas");
    if (canvas) {
        // Force ATS theme for print
        canvas.className = "resume-paper theme-ats-light";
        // Force scaling to fit on one page
        adjustPrintScale();
    }
});

window.addEventListener("afterprint", () => {
    // Restore the original theme after print
    const canvas = document.getElementById("resume-canvas");
    if (canvas) {
        const isAtsTheme = document.getElementById("theme-ats").classList.contains("active");
        canvas.className = isAtsTheme ? "resume-paper theme-ats-light" : "resume-paper theme-luxury-dark";
    }
});

// ==========================================================================
// ATS Score Analyzer & Job Match Suggestion Engine
// ==========================================================================

// Action verbs commonly expected by ATS systems
const ACTION_VERBS = [
    "led", "managed", "developed", "designed", "implemented", "created",
    "built", "launched", "engineered", "optimized", "improved", "increased",
    "reduced", "achieved", "delivered", "established", "spearheaded",
    "coordinated", "streamlined", "automated", "mentored", "directed",
    "analyzed", "integrated", "architected", "transformed", "scaled",
    "negotiated", "collaborated", "executed", "maintained", "supervised",
    "trained", "resolved", "initiated", "facilitated", "generated",
    "published", "deployed", "configured", "migrated", "refactored"
];

// Quantitative metrics patterns (ATS love numbers)
const METRICS_PATTERNS = [
    /\d+%/,           // percentages
    /\$[\d,]+/,       // dollar amounts
    /\d+[kKmMbB]\+?/, // abbreviated numbers
    /\d+\+/,          // number+ format
    /\d+x/i,          // multiplier format
];

// Comprehensive job profiles database for matching
const JOB_PROFILES = [
    {
        title: "Flutter App Developer",
        keywords: ["flutter", "dart", "mobile", "ios", "android", "widget", "bloc", "provider", "getx", "riverpod", "firebase", "play store", "app store", "cross-platform", "ui/ux"],
        category: "Mobile Development",
        icon: "📱"
    },
    {
        title: "Mobile Application Developer",
        keywords: ["mobile", "ios", "android", "react native", "flutter", "swift", "kotlin", "java", "app development", "cross-platform", "native"],
        category: "Mobile Development",
        icon: "📲"
    },
    {
        title: "Frontend Web Developer",
        keywords: ["html", "css", "javascript", "react", "vue", "angular", "typescript", "next.js", "tailwind", "sass", "webpack", "responsive", "ui", "ux", "frontend", "front-end"],
        category: "Web Development",
        icon: "🌐"
    },
    {
        title: "Full Stack Developer",
        keywords: ["full stack", "fullstack", "node", "express", "react", "vue", "angular", "mongodb", "postgresql", "mysql", "api", "rest", "graphql", "docker", "aws", "backend", "frontend"],
        category: "Web Development",
        icon: "⚙️"
    },
    {
        title: "Backend Developer",
        keywords: ["backend", "back-end", "node", "python", "django", "flask", "java", "spring", "api", "rest", "graphql", "microservices", "database", "sql", "nosql", "aws", "docker"],
        category: "Web Development",
        icon: "🔧"
    },
    {
        title: "Software Engineer",
        keywords: ["software", "engineer", "programming", "algorithms", "data structures", "oop", "design patterns", "git", "ci/cd", "agile", "scrum", "testing", "debugging"],
        category: "Software Engineering",
        icon: "💻"
    },
    {
        title: "DevOps Engineer",
        keywords: ["devops", "ci/cd", "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ansible", "jenkins", "github actions", "monitoring", "linux", "automation", "infrastructure"],
        category: "Infrastructure",
        icon: "🚀"
    },
    {
        title: "Data Scientist",
        keywords: ["data science", "machine learning", "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "statistics", "deep learning", "nlp", "data analysis", "jupyter"],
        category: "Data & AI",
        icon: "📊"
    },
    {
        title: "Data Analyst",
        keywords: ["data analysis", "sql", "excel", "tableau", "power bi", "python", "r", "statistics", "reporting", "visualization", "etl", "data", "analytics"],
        category: "Data & AI",
        icon: "📈"
    },
    {
        title: "UI/UX Designer",
        keywords: ["ui", "ux", "design", "figma", "sketch", "adobe xd", "wireframe", "prototype", "user research", "usability", "interaction design", "visual design", "design system"],
        category: "Design",
        icon: "🎨"
    },
    {
        title: "Cloud Solutions Architect",
        keywords: ["cloud", "aws", "azure", "gcp", "architecture", "microservices", "serverless", "lambda", "s3", "ec2", "terraform", "solutions", "infrastructure"],
        category: "Cloud & Infrastructure",
        icon: "☁️"
    },
    {
        title: "Cybersecurity Analyst",
        keywords: ["security", "cybersecurity", "penetration testing", "vulnerability", "firewall", "siem", "encryption", "compliance", "incident response", "network security"],
        category: "Security",
        icon: "🔒"
    },
    {
        title: "Project Manager (Tech)",
        keywords: ["project management", "agile", "scrum", "kanban", "jira", "leadership", "team management", "stakeholder", "budget", "planning", "risk management", "pmp"],
        category: "Management",
        icon: "📋"
    },
    {
        title: "QA / Test Engineer",
        keywords: ["testing", "qa", "quality assurance", "automation", "selenium", "cypress", "jest", "junit", "test plan", "bug", "regression", "performance testing", "manual testing"],
        category: "Quality Assurance",
        icon: "✅"
    },
    {
        title: "Machine Learning Engineer",
        keywords: ["machine learning", "deep learning", "tensorflow", "pytorch", "neural network", "nlp", "computer vision", "mlops", "model", "training", "ai", "artificial intelligence"],
        category: "Data & AI",
        icon: "🤖"
    },
    {
        title: "Database Administrator",
        keywords: ["database", "sql", "mysql", "postgresql", "mongodb", "oracle", "redis", "dba", "backup", "replication", "performance tuning", "indexing"],
        category: "Database",
        icon: "🗄️"
    },
    {
        title: "Technical Writer",
        keywords: ["documentation", "technical writing", "api documentation", "markdown", "content", "writing", "communication", "user guide", "knowledge base"],
        category: "Content",
        icon: "✍️"
    },
    {
        title: "Embedded Systems Engineer",
        keywords: ["embedded", "firmware", "c", "c++", "rtos", "microcontroller", "iot", "hardware", "arm", "arduino", "raspberry pi", "pcb"],
        category: "Hardware/IoT",
        icon: "🔌"
    },
    {
        title: "Game Developer",
        keywords: ["game", "unity", "unreal", "c#", "c++", "3d", "2d", "animation", "shader", "physics", "game design", "opengl", "directx"],
        category: "Game Development",
        icon: "🎮"
    },
    {
        title: "Blockchain Developer",
        keywords: ["blockchain", "solidity", "ethereum", "smart contract", "web3", "defi", "nft", "cryptocurrency", "decentralized", "dapp"],
        category: "Blockchain",
        icon: "⛓️"
    },
    {
        title: "Digital Marketing Specialist",
        keywords: ["marketing", "seo", "sem", "google ads", "social media", "content marketing", "analytics", "campaign", "email marketing", "growth"],
        category: "Marketing",
        icon: "📢"
    },
    {
        title: "Product Manager",
        keywords: ["product management", "roadmap", "user stories", "stakeholder", "strategy", "analytics", "a/b testing", "market research", "prm", "agile"],
        category: "Product",
        icon: "🎯"
    },
    {
        title: "System Administrator",
        keywords: ["system admin", "linux", "windows server", "networking", "active directory", "dns", "dhcp", "vpn", "backup", "monitoring", "troubleshooting"],
        category: "IT Operations",
        icon: "🖥️"
    },
    {
        title: "Network Engineer",
        keywords: ["network", "cisco", "routing", "switching", "tcp/ip", "firewall", "lan", "wan", "vpn", "ccna", "ccnp", "network security"],
        category: "Networking",
        icon: "🌍"
    }
];


function openATSAnalyzer() {
    const result = calculateATSScore();
    const jobs = getJobSuggestions();
    renderATSModal(result, jobs);
    document.getElementById("ats-modal-overlay").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeATSModal() {
    document.getElementById("ats-modal-overlay").classList.remove("active");
    document.body.style.overflow = "";
}

// ---- ATS Score Calculator ----
function calculateATSScore() {
    const checks = [];
    let totalScore = 0;
    const suggestions = [];

    // Helper: get all text content from resume
    const allText = [
        resumeData.fullname, resumeData.jobtitle, resumeData.summary, resumeData.skills,
        ...resumeData.workExperience.map(w => `${w.title} ${w.company} ${w.details}`),
        ...resumeData.education.map(e => `${e.degree} ${e.school} ${e.details}`),
        ...resumeData.projects.map(p => `${p.name} ${p.role} ${p.description}`),
        ...resumeData.certifications.map(c => `${c.name} ${c.issuer}`)
    ].join(" ").toLowerCase();

    // 1. Full Name (5 pts)
    const hasName = !!(resumeData.fullname && resumeData.fullname.trim().length >= 2);
    checks.push({ label: "Full Name Present", score: hasName ? 5 : 0, max: 5, pass: hasName });
    totalScore += hasName ? 5 : 0;
    if (!hasName) suggestions.push("Add your full professional name.");

    // 2. Professional Title (5 pts)
    const hasTitle = !!(resumeData.jobtitle && resumeData.jobtitle.trim().length >= 3);
    checks.push({ label: "Professional Title", score: hasTitle ? 5 : 0, max: 5, pass: hasTitle });
    totalScore += hasTitle ? 5 : 0;
    if (!hasTitle) suggestions.push("Add a clear professional title (e.g. 'Flutter Developer').");

    // 3. Email (5 pts)
    const hasEmail = !!(resumeData.email && resumeData.email.trim().includes("@"));
    checks.push({ label: "Email Address", score: hasEmail ? 5 : 0, max: 5, pass: hasEmail });
    totalScore += hasEmail ? 5 : 0;
    if (!hasEmail) suggestions.push("Include a professional email address.");

    // 4. Phone (5 pts)
    const hasPhone = !!(resumeData.phone && resumeData.phone.trim().length >= 5);
    checks.push({ label: "Phone Number", score: hasPhone ? 5 : 0, max: 5, pass: hasPhone });
    totalScore += hasPhone ? 5 : 0;
    if (!hasPhone) suggestions.push("Add your phone number for recruiter contact.");

    // 5. Location (3 pts)
    const hasLocation = !!(resumeData.location && resumeData.location.trim().length >= 3);
    checks.push({ label: "Location Info", score: hasLocation ? 3 : 0, max: 3, pass: hasLocation });
    totalScore += hasLocation ? 3 : 0;
    if (!hasLocation) suggestions.push("Mention your city/location or 'Open to Remote'.");

    // 6. LinkedIn (4 pts)
    const hasLinkedin = !!(resumeData.linkedin && resumeData.linkedin.trim().length >= 5);
    checks.push({ label: "LinkedIn Profile", score: hasLinkedin ? 4 : 0, max: 4, pass: hasLinkedin });
    totalScore += hasLinkedin ? 4 : 0;
    if (!hasLinkedin) suggestions.push("Add your LinkedIn profile URL.");

    // 7. Professional Summary (10 pts)
    const summaryWords = resumeData.summary ? resumeData.summary.trim().split(/\s+/).length : 0;
    let summaryScore = 0;
    if (summaryWords >= 40) summaryScore = 10;
    else if (summaryWords >= 20) summaryScore = 6;
    else if (summaryWords >= 5) summaryScore = 3;
    checks.push({ label: "Professional Summary", score: summaryScore, max: 10, pass: summaryScore >= 6 });
    totalScore += summaryScore;
    if (summaryScore < 10) suggestions.push("Write a professional summary with at least 40-60 words highlighting key achievements.");

    // 8. Work Experience Exists (10 pts)
    const expCount = resumeData.workExperience.length;
    let expScore = 0;
    if (expCount >= 2) expScore = 10;
    else if (expCount === 1) expScore = 7;
    checks.push({ label: "Work Experience Entries", score: expScore, max: 10, pass: expScore >= 7 });
    totalScore += expScore;
    if (expScore < 10) suggestions.push("Add at least 2 relevant work experience entries.");

    // 9. Bullet Points / Details in Experience (8 pts)
    let totalBullets = 0;
    resumeData.workExperience.forEach(w => {
        if (w.details) {
            totalBullets += w.details.split("\n").filter(l => l.trim().length > 0).length;
        }
    });
    let bulletScore = 0;
    if (totalBullets >= 6) bulletScore = 8;
    else if (totalBullets >= 3) bulletScore = 5;
    else if (totalBullets >= 1) bulletScore = 2;
    checks.push({ label: "Achievement Bullet Points", score: bulletScore, max: 8, pass: bulletScore >= 5 });
    totalScore += bulletScore;
    if (bulletScore < 8) suggestions.push("Add 3-5 achievement bullet points per job with metrics and action verbs.");

    // 10. Action Verbs Used (7 pts)
    let actionVerbCount = 0;
    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) actionVerbCount++;
    });
    let actionScore = 0;
    if (actionVerbCount >= 8) actionScore = 7;
    else if (actionVerbCount >= 5) actionScore = 5;
    else if (actionVerbCount >= 2) actionScore = 3;
    checks.push({ label: "Action Verbs Usage", score: actionScore, max: 7, pass: actionScore >= 5 });
    totalScore += actionScore;
    if (actionScore < 7) suggestions.push("Use strong action verbs like 'Led', 'Developed', 'Optimized', 'Engineered', 'Deployed'.");

    // 11. Quantified Metrics (5 pts)
    let metricsFound = 0;
    METRICS_PATTERNS.forEach(pattern => {
        const matches = allText.match(new RegExp(pattern.source, "gi"));
        if (matches) metricsFound += matches.length;
    });
    let metricsScore = 0;
    if (metricsFound >= 3) metricsScore = 5;
    else if (metricsFound >= 1) metricsScore = 3;
    checks.push({ label: "Quantified Metrics (Numbers/%%)", score: metricsScore, max: 5, pass: metricsScore >= 3 });
    totalScore += metricsScore;
    if (metricsScore < 5) suggestions.push("Add quantifiable metrics: '25% revenue increase', 'managed team of 10', '$2M budget'.");

    // 12. Skills Section (10 pts)
    const skillList = resumeData.skills ? resumeData.skills.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
    let skillsScore = 0;
    if (skillList.length >= 10) skillsScore = 10;
    else if (skillList.length >= 6) skillsScore = 7;
    else if (skillList.length >= 3) skillsScore = 4;
    else if (skillList.length >= 1) skillsScore = 2;
    checks.push({ label: "Skills Listed (" + skillList.length + " found)", score: skillsScore, max: 10, pass: skillsScore >= 7 });
    totalScore += skillsScore;
    if (skillsScore < 10) suggestions.push("List at least 10+ relevant technical and soft skills.");

    // 13. Education (8 pts)
    const eduCount = resumeData.education.length;
    let eduScore = 0;
    if (eduCount >= 1) eduScore = 8;
    checks.push({ label: "Education Section", score: eduScore, max: 8, pass: eduScore >= 8 });
    totalScore += eduScore;
    if (eduScore < 8) suggestions.push("Add your education history (degree, university, year).");

    // 14. Projects Section (5 pts)
    const projCount = resumeData.projects.length;
    let projScore = 0;
    if (projCount >= 2) projScore = 5;
    else if (projCount === 1) projScore = 3;
    checks.push({ label: "Key Projects", score: projScore, max: 5, pass: projScore >= 3 });
    totalScore += projScore;
    if (projScore < 5) suggestions.push("Add at least 2 key projects with descriptions and your role.");

    // 15. Certifications (5 pts)
    const certCount = resumeData.certifications.length;
    let certScore = 0;
    if (certCount >= 2) certScore = 5;
    else if (certCount === 1) certScore = 3;
    checks.push({ label: "Certifications", score: certScore, max: 5, pass: certScore >= 3 });
    totalScore += certScore;
    if (certScore < 3) suggestions.push("Add relevant certifications (online courses, professional certs).");

    // 16. Languages (2 pts)
    const langCount = resumeData.languages.length;
    let langScore = 0;
    if (langCount >= 1) langScore = 2;
    checks.push({ label: "Languages Listed", score: langScore, max: 2, pass: langScore >= 2 });
    totalScore += langScore;

    // 17. GitHub / Portfolio Link (3 pts)
    const hasGithubOrPortfolio = !!(resumeData.github && resumeData.github.trim()) || !!(resumeData.website && resumeData.website.trim());
    checks.push({ label: "GitHub / Portfolio Link", score: hasGithubOrPortfolio ? 3 : 0, max: 3, pass: hasGithubOrPortfolio });
    totalScore += hasGithubOrPortfolio ? 3 : 0;
    if (!hasGithubOrPortfolio) suggestions.push("Add a GitHub profile or portfolio link to showcase your work.");

    // Determine verdict
    let verdict = "";
    let verdictClass = "";
    if (totalScore >= 85) { verdict = "🏆 Excellent! Highly ATS-Optimized"; verdictClass = "excellent"; }
    else if (totalScore >= 70) { verdict = "✅ Good - Ready for Submission"; verdictClass = "good"; }
    else if (totalScore >= 50) { verdict = "⚠️ Fair - Needs Improvement"; verdictClass = "fair"; }
    else { verdict = "❌ Weak - Significant Work Needed"; verdictClass = "weak"; }

    return { totalScore, checks, suggestions, verdict, verdictClass };
}

// ---- Job Suggestion Engine ----
function getJobSuggestions() {
    // Build a unified keyword pool from resume data
    const allText = [
        resumeData.jobtitle || "",
        resumeData.summary || "",
        resumeData.skills || "",
        ...resumeData.workExperience.map(w => `${w.title || ""} ${w.company || ""} ${w.details || ""}`),
        ...resumeData.projects.map(p => `${p.name || ""} ${p.role || ""} ${p.description || ""}`),
        ...resumeData.education.map(e => `${e.degree || ""} ${e.details || ""}`),
        ...resumeData.certifications.map(c => `${c.name || ""} ${c.issuer || ""}`)
    ].join(" ").toLowerCase();

    if (allText.trim().length < 10) return [];

    const scored = JOB_PROFILES.map(profile => {
        let matchCount = 0;
        let matchedKeywords = [];
        profile.keywords.forEach(kw => {
            if (allText.includes(kw.toLowerCase())) {
                matchCount++;
                matchedKeywords.push(kw);
            }
        });
        const matchPercent = Math.round((matchCount / profile.keywords.length) * 100);
        return {
            ...profile,
            matchCount,
            matchedKeywords,
            matchPercent
        };
    });

    // Filter (at least 2 keyword matches) and sort by match percentage
    return scored
        .filter(j => j.matchCount >= 2)
        .sort((a, b) => b.matchPercent - a.matchPercent)
        .slice(0, 8); // Top 8 matches
}

// ---- Modal Renderer ----
function renderATSModal(result, jobs) {
    // --- Score Ring Animation ---
    const scoreNum = document.getElementById("ats-score-number");
    const ringProgress = document.getElementById("ats-ring-progress");
    const circumference = 2 * Math.PI * 52;
    ringProgress.style.strokeDasharray = circumference;
    ringProgress.style.strokeDashoffset = circumference;

    // Set ring color based on score
    let ringColor = "#ef4444"; // red
    if (result.totalScore >= 85) ringColor = "#10b981";
    else if (result.totalScore >= 70) ringColor = "#3b82f6";
    else if (result.totalScore >= 50) ringColor = "#f59e0b";
    ringProgress.style.stroke = ringColor;

    // Animate score number and ring
    let currentScore = 0;
    const animDuration = 1200;
    const startTime = performance.now();
    function animateScore(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / animDuration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        currentScore = Math.round(eased * result.totalScore);
        scoreNum.textContent = currentScore;
        const offset = circumference - (eased * result.totalScore / 100) * circumference;
        ringProgress.style.strokeDashoffset = offset;
        if (progress < 1) requestAnimationFrame(animateScore);
    }
    requestAnimationFrame(animateScore);

    // Verdict
    const verdictEl = document.getElementById("ats-score-verdict");
    verdictEl.textContent = result.verdict;
    verdictEl.className = "ats-score-verdict " + result.verdictClass;

    // Summary
    const passCount = result.checks.filter(c => c.pass).length;
    document.getElementById("ats-score-summary").textContent =
        `${passCount} of ${result.checks.length} criteria passed | Total Score: ${result.totalScore}/100`;

    // --- Breakdown ---
    const breakdownList = document.getElementById("ats-breakdown-list");
    breakdownList.innerHTML = result.checks.map(check => `
        <div class="ats-breakdown-item ${check.pass ? 'pass' : 'fail'}">
            <span class="ats-check-icon">${check.pass ? '✅' : '❌'}</span>
            <span class="ats-check-label">${check.label}</span>
            <span class="ats-check-score">${check.score} / ${check.max}</span>
            <div class="ats-check-bar">
                <div class="ats-check-bar-fill" style="width: ${(check.score / check.max) * 100}%"></div>
            </div>
        </div>
    `).join("");

    // --- Suggestions ---
    const sugList = document.getElementById("ats-suggestions-list");
    if (result.suggestions.length === 0) {
        sugList.innerHTML = `<div class="ats-suggestion-item perfect">🎉 Your resume is well-optimized! No critical improvements needed.</div>`;
    } else {
        sugList.innerHTML = result.suggestions.map(s => `
            <div class="ats-suggestion-item">
                <span class="sug-icon">💡</span>
                <span>${s}</span>
            </div>
        `).join("");
    }

    // --- Job Suggestions ---
    const jobsList = document.getElementById("ats-jobs-list");
    if (jobs.length === 0) {
        jobsList.innerHTML = `<div class="ats-no-jobs">📝 Add more skills and work experience to get job match suggestions.</div>`;
    } else {
        jobsList.innerHTML = jobs.map(job => {
            let matchClass = "low";
            if (job.matchPercent >= 60) matchClass = "high";
            else if (job.matchPercent >= 35) matchClass = "medium";
            return `
                <div class="ats-job-card">
                    <div class="ats-job-header">
                        <span class="ats-job-icon">${job.icon}</span>
                        <div class="ats-job-info">
                            <span class="ats-job-title">${job.title}</span>
                            <span class="ats-job-category">${job.category}</span>
                        </div>
                        <div class="ats-job-match ${matchClass}">
                            <span class="ats-job-match-num">${job.matchPercent}%</span>
                            <span class="ats-job-match-label">Match</span>
                        </div>
                    </div>
                    <div class="ats-job-keywords">
                        ${job.matchedKeywords.map(kw => `<span class="ats-kw-tag">${kw}</span>`).join("")}
                    </div>
                </div>
            `;
        }).join("");
    }
}

// Mobile Workspace Tab Switcher
function initMobileTabs() {
    const tabsContainer = document.getElementById("mobile-workspace-tabs");
    const workspace = document.querySelector(".app-workspace");
    if (!tabsContainer || !workspace) return;
    
    // Set initial class
    workspace.classList.add("tab-editor");
    
    const buttons = tabsContainer.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            if (targetTab === "preview") {
                workspace.classList.remove("tab-editor");
                workspace.classList.add("tab-preview");
                // Trigger a resize event to recalculate canvas scaling when preview is shown
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    const viewport = document.querySelector(".canvas-viewport");
                    if (viewport) viewport.scrollTop = 0;
                }, 50);
            } else {
                workspace.classList.remove("tab-preview");
                workspace.classList.add("tab-editor");
            }
        });
    });
}
