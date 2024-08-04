Pantry
Pantry is a Next.js application designed to help users manage their pantry items. The app includes features such as item tracking, category management, and image recognition for classifying items.

Project Setup
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js (version 14 or later)
npm or yarn

Installation
Clone the repository:

bash
Copy code
git clone https://github.com/MuhammadHamza00/pantry.git
cd pantry
Install dependencies:

Using npm:

bash
Copy code
npm install
Using yarn:

bash
Copy code
yarn install
Install Additional Packages:

The project requires several additional packages:

Firebase: For backend services like authentication and Firestore.
Material-UI (MUI): For UI components.
MUI Icons: For Material Design icons.
React Webcam: For capturing images from the user's webcam.
Next PWA: For Progressive Web App support.
Clarifai SDK: For image recognition and classification.
You can install these packages using the following commands:

bash
Copy code
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install firebase
npm install react-webcam
npm install next-pwa
npm install clarifai
Environment Variables:

Create a .env.local file in the root directory and add the following variables:

env
Copy code
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_CLARIFAI_API_KEY=your_clarifai_api_key
Replace the placeholders with your actual Firebase and Clarifai credentials.

Running the Application
To start the development server, run:

bash
Copy code
npm run dev
This command will start the application at http://localhost:3000.

Deployment
The application can be easily deployed to Vercel. Make sure to set the environment variables in the Vercel dashboard.

Project Structure
src/app: Contains the main app pages and components.
src/components: Reusable components like Sidebar, PantryTable, etc.
firebase: Configuration and setup for Firebase services.
public: Public assets like images and icons.

Features
Authentication: Users can sign up and log in using Firebase Authentication.
Pantry Management: Users can add, edit, and delete pantry items.
Category Management: Users can manage categories for organizing pantry items.
Image Recognition: Uses Clarifai for classifying images captured via webcam.
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
