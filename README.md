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
- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas

## How to Run Locally

MediClear operates across two synchronized web views driven by a local backend. To test the full flow, you will need to run the application locally using npm.

### Prerequisites
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Create a `.env` file in the root directory and add your MongoDB connection string:
   `MONGODB_URI=your_mongodb_connection_string_here`
3. (Optional) Add `VITE_ADMIN_PASSWORD=your_custom_password` to your `.env` file to override the default local nurse portal password.

### Starting the Servers
1. **Start the Backend API:** Open a terminal, navigate to the project directory, install dependencies, and start the server:
   ```bash
   npm install
   node server/index.js