# Project Name: Travel Helth Adviser 

![helth](images/helth.png)

# Team Name

VibeCoders

# Track

- AI/ML
- Health

# Team Members

- Aryan Miriyala
- Cristian Vasu
- Daltiso Mtalimanja
- Tibor Gebhartl

# Travel Health Advisory Map

This project is a React application built with Vite that displays an interactive world map using `react-simple-maps`. Clicking on a country highlights it and shows the selected country name. A floating AI chatbot using Mistral AI is also integrated to answer health-related questions.

## Requirements

- Node.js v16 or higher
- npm (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://your-repo-url.git
cd travel-health
```

### 2. Install Dependencies

Make sure you're using **React 18**, as `react-simple-maps` does not support React 19.

```bash
npm uninstall react react-dom
npm install react@18 react-dom@18
```

Then install all dependencies:

```bash
npm install
npm install react-simple-maps d3 topojson axios react-router-dom
```

### 3. Set Up Mistral AI API Key

Create a `.env` file in the root of the project and add your Mistral API key:

```
VITE_MISTRAL_API_KEY=your_mistral_api_key_here
```

> Do **not** commit this file to Git. It is already ignored via `.gitignore`.

### 4. Run the Application

```bash
npm run dev
node server.js
```

Visit `http://localhost:5173` in your browser.

## Project Features

- 🌍 **Interactive World Map** — Built with `react-simple-maps`. Click on a country to view its name.
- 🤖 **Floating AI Chatbot** — Ask questions about travel health using Mistral AI. Chatbot is toggleable and floats over the map.
- 🔐 **Environment-secure API integration** — Your Mistral API key is safely stored using Vite's `.env` system.
- 👥 **Login/Signup Page** — React Router is used to navigate between authentication and the main map.

## File Structure

```
travel-health/
├── src/
│   ├── components/
│   │   ├── WorldMap.jsx
│   │   └── Chatbot.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Dependencies

```json
"react": "^18",
"react-dom": "^18",
"react-simple-maps": "^3.0.0",
"d3": "^7.8.5",
"topojson": "^3.0.2",
"axios": "^1.6.7",
"react-router-dom": "^6.22.3"
```

## Notes

- Do **not upgrade React to 19**, as it will cause peer dependency issues with `react-simple-maps`.
- If the map does not load, ensure that the `geoUrl` in `WorldMap.jsx` is correct and accessible.
- For Mistral API details, visit [https://docs.mistral.ai](https://docs.mistral.ai)

## License

MIT