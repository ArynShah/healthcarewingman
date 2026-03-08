# MediClear

MediClear is a dual-portal web application designed to bridge the communication gap between emergency room staff and patients. It gives patients live visibility into their care journey while providing nurses with a command center to manage triage routing and facility resources. 

This project was built to help reduce the clinical anxiety patients experience when sitting in a waiting room with no idea what is happening, what tests they are waiting for, or why the process is taking so long.

## Features

**For Patients (Mobile-First Portal):**
- Live treatment plan tracking that updates automatically when the triage nurse advances their stage.
- Wait Room Wellness tools, including a guided breathing pacer and grounding exercises to manage anxiety.
- Live queue position and estimated wait times for the immediate next diagnostic step.
- Facility transparency, showing whether the specific machine they need (like an MRI or X-Ray) is currently in use or available.

**For Nurses & Admin (Desktop Command Center):**
- Intake dashboard to log patient symptoms and sequence a customized list of diagnostic steps.
- Active directory to manage the live treatment stage of all current patients.
- Facility routing control to manually update the availability of hospital machines.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router (Deployed on Vercel)
- Backend: Node.js, Express (Deployed on Render)
- Database: MongoDB Atlas

## How to Use the Live Application

MediClear operates across two synchronized web views. To test the full flow, you will need to use both the Nurse Command Center and the Patient Portal. 

1. Navigate to the deployed Nurse Command Center by using this project URL (https://mediclearhc.vercel.app/nurse).
2. Log in using the default admin password: `mediclear123`.
3. Go to the "Add Patient" tab. Enter a test name, select a few symptoms, and click a few routing steps (such as Blood Work and an X-Ray). 
4. Click the generate button at the bottom of the screen to receive a 6-character patient access code.
5. Open a new browser tab or use your phone and go to the main Patient Portal at the root Vercel URL (https://mediclearhc.vercel.app/).
6. Enter the 6-character code you just generated.
7. You will now see the live patient dashboard. To see the real-time synchronization, go back to the Nurse Command Center's "Active Directory" tab, advance the patient's stage, or change machine statuses in the "Facility Routing" tab, and watch the changes reflect immediately on the Patient Portal.