# DigiBhoomi — Real-Time National Land Acquisition & Management System

Full-stack build for SIH problem statement 26016 (Ministry of Rural Development · Dept. of Land Resources).

Real-Time National Land Acquisition & Management System

SIH 2026 — Problem Statement 26016

DigiBhoomi is a unified platform for end-to-end land acquisition monitoring, connecting government authorities, project agencies, field officers, and landowners.

Key Features
🏛️ Role-Based Access: DoLR → State → District → PIA → Field Officer → Land Owner
🗺️ GIS Mapping: Projects, parcels, villages and field locations
🔄 Acquisition Workflow: Proposal → Verification → Award → Compensation → Possession → R&R
📍 Field Operations: Geo-tagging, verification and site evidence
📄 Document Management: Upload, verification, approval and tracking
💰 Compensation & R&R: Track payments, affected families and entitlements
🔔 Notifications & Escalation: Automated alerts and pending actions
🤖 AI Decision Support: Risk detection and intervention recommendations
📊 Dashboards & Analytics: National, State, District and Project-level monitoring
Tech Stack

Frontend: React.js, Tailwind CSS, Leaflet, Recharts
Backend: Node.js, Express.js, REST APIs, JWT
Database: PostgreSQL + PostGIS
GIS: Leaflet + PostGIS

## Real file upload (Landowner, Field Officer, Project Manager/PIA)
Document upload now handles actual files, not just metadata:
- Backend uses `multer` to accept `PDF, JPG, PNG, WEBP, DOC, DOCX` up to 15 MB, saved to `backend/uploads/` (gitignored — regenerated at runtime, not something you commit).
- Files are served back through an authenticated endpoint (`GET /api/documents/:id/file`) — landowners can only fetch their own files; officers can fetch any file for a project in their scope.
- Bad file types or oversized files get a clean JSON error, not a raw server crash.
- The "Upload Document" button on the Documents page now includes a real file picker, and the "My Documents" table shows a clickable filename that opens/downloads the actual uploaded file.
