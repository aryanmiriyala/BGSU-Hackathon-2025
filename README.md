# Travel Health Advisory Map

This is a React 18 + Vite application that uses [react-simple-maps](https://www.react-simple-maps.io/) to render an interactive world map. When you click on a country, it shows the country name. The setup is lightweight, easy to extend, and styled with minimal custom CSS.

## Prerequisites

Make sure all group members have the following installed:

- Node.js (v16 or later)
- npm (v8 or later)

You can check by running:

```bash
node -v
npm -v
```

## React Version

This project uses:

- **React v18**
- **react-dom v18**

## Setup Instructions

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/travel-health.git
cd travel-health
```

2. **Install the dependencies**:

```bash
npm install
```

3. **Run the development server**:

```bash
npm run dev
```

The app will be running at:

```
http://localhost:5173
```

## Key Dependencies

```json
"react": "^18.0.0",
"react-dom": "^18.0.0",
"react-simple-maps": "^3.0.0",
"d3": "^7.0.0",
"topojson": "^3.0.2"
```

## Map Configuration

The map uses a stable TopoJSON source:

```js
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
```

## Project Structure

```
travel-health/
├── public/
├── src/
│   ├── components/
│   │   └── WorldMap.jsx       # Main map logic and rendering
│   ├── App.jsx                # Application wrapper
│   ├── main.jsx               # React root
│   └── index.css              # Basic global styles
├── index.html                 # HTML entry point
├── package.json               # Project metadata and scripts
└── README.md                  # Project documentation
```

## Next Steps

- Hook up real health data APIs per country
- Add a sidebar or popup component to display country details
- Style the app using TailwindCSS or another framework

## License

MIT
