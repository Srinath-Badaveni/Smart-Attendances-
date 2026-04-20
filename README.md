# NoProxy: AI-Powered Biometric Attendance System

NoProxy is a modern, decoupled web application designed to revolutionize attendance tracking in educational and corporate environments. By replacing manual registers with advanced **Face and Voice Biometrics**, NoProxy ensures 100% accuracy and eliminates "proxy" attendance.

---

## 🚀 Vision
To provide a seamless, secure, and automated attendance experience using state-of-the-art Computer Vision and Deep Learning with NoProxy.

## ✨ Key Features
- **Dual-Biometric Authentication**: Secure student registration and verification using Face ID and Voice ID.
- **Group Face Recognition**: Identify multiple students simultaneously from a single group photo using SVM-based classification.
- **Speaker Verification**: Deep learning-based speaker embedding analysis to verify identity via voice clips.
- **Teacher Dashboard**: Comprehensive management interface for subjects, students, and attendance reports.
- **Real-time Analytics**: Instant feedback on attendance percentages and student participation.
- **Premium UI/UX**: Dark-themed, high-fidelity design built with React and custom CSS systems.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS (Custom Design System), Tailwind CSS (Utilities)
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & Framer Motion

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI/ML Pipelines**:
  - **Face**: Dlib-based detection + `face_recognition` encodings.
  - **Classification**: Scikit-learn (SVM / Linear SVC).
  - **Voice**: Resemblyzer (Speaker Embeddings) + Librosa.
- **Utilities**: Segno (QR), NumPy, Pandas.

---

## 🏗️ Architecture & Flow

### 1. Registration
- Students provide a face sample and a voice recording.
- The system extracts a **128-dimensional face embedding** and a speaker embedding.
- Data is stored in Supabase for future matching.

### 2. Detection & Matching
- When a class photo is uploaded, the system detects all faces using the HOG/CNN detector.
- A **Linear SVM Classifier** is trained (or retrieved from cache) on all student embeddings.
- The system predicts the identity of each face found in the image with a confidence threshold-based distance check.

### 3. Verification
- Attendance is automatically marked in the PostgreSQL database if the biometric score exceeds the threshold ($>0.6$).

---

## 📂 Project Structure

```text
├── backend/
│   ├── api/             # API Core logic
│   ├── pipelines/       # AI/ML logic (Face/Voice)
│   ├── routers/         # FastAPI endpoints (Auth, Attendance, Students)
│   ├── db.py            # Supabase connection & helpers
│   └── main.py          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Dashboard, Login, Registration
│   │   ├── api/         # Axios configurations
│   │   └── App.jsx      # Main routing
└── README.md
```

---

## ⚙️ Setup & Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your `.env` file with Supabase credentials:
   ```env
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is for educational/professional portfolio use. All rights reserved.

---

## 🤝 Contributing
Feel free to fork this repository and submit pull requests for any features or bug fixes.

---

*Developed with ❤️ by Srinath Badaveni*
