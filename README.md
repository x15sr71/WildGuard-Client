# 🐾 WildGuard Client

WildGuard is a platform designed to help people find the best NGOs and shelters for wildlife in need. The client-side of WildGuard is built using React, Tailwind CSS, ShadCN UI, and Vite, providing a seamless and intuitive experience for users.

## 🌿 Features

- **🔍 Search for NGOs & Organizations**: Users can easily find nearby NGOs and shelters for wildlife assistance.
- **📸 AI-Powered Image Recognition**: Utilize Google AI Vision to identify animals and suggest relevant NGOs.
- **🦸 Volunteer & NGO Registration**: Allows individuals to sign up as volunteers and organizations to register their shelters.
- **🗺️ Interactive Google Maps Integration**: Displays NGO locations with navigation assistance.
- **🎨 Modern UI/UX**: Built with Tailwind CSS and ShadCN UI for a sleek and responsive design.
- **🔐 Firebase Authentication**: Secure user authentication using Firebase.

## 🏗️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Backend (Connected API)**: Node.js (Express) with PostgreSQL (Google Cloud SQL)
- **Database ORM**: Prisma (Supabase PostgreSQL for development)
- **Authentication**: Firebase
- **Hosting**: Firebase Hosting

## ⚙️ Installation

### Prerequisites
- 🦊 Node.js (latest LTS recommended)
- 📦 npm or yarn
- 🔥 Firebase CLI (for deployment and local testing)

### Steps
1. 🏕️ Clone the repository:
   ```sh
   git clone https://github.com/yourusername/wildguard-client.git
   cd wildguard-client
   ```
2. 📥 Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. 📝 Set up environment variables:
   Create a `.env` file and add required API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_BACKEND_URL=https://your-backend-url.com
   ```
4. 🚀 Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

## 🌍 Deployment

To deploy to Firebase Hosting:
```sh
firebase deploy
```

## 🤝 Contribution

We welcome contributions! Feel free to open issues and submit pull requests.

## 📜 License

WildGuard is licensed under the MIT License.

## 📩 Contact
For any inquiries, reach out to [your email/contact info].

