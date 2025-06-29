# LectureMind Frontend

A sophisticated React-based application that transforms lectures into interactive mind maps using voice recognition and AI-powered content generation. LectureMind helps students and educators capture, organize, and visualize lecture content in real-time.


##  Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lecturemind-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

##  Usage Guide

### Basic Mind Mapping
1. **Start Voice Recognition**: Click the microphone button to begin listening
2. **Add Keywords**: Use the keyword input to specify terms you want to detect
3. **Speak Naturally**: The app will automatically detect keywords and create nodes
4. **Customize Nodes**: Click on nodes to edit labels, colors, and add descriptions

### Art History Mode
1. **Select Period**: Choose from Renaissance, Baroque, Impressionism, or Modern periods
2. **Mention Artists**: When you mention artist names, specialized nodes are created
3. **AI Descriptions**: Artist nodes automatically include AI-generated descriptions
4. **Timeline View**: Use the timeline to track lecture progress


## Project Structure

```
src/
├── components/          # React components
│   ├── ArtistNode.jsx   # Artist-specific node component
│   ├── DetectedPanel.jsx # Panel for detected keywords
│   ├── FullTranscriptPanel.jsx # Full transcript display
│   ├── KeywordInput.jsx # Keyword management interface
│   ├── NodeEditor.jsx   # Node editing interface
│   └── Timeline.jsx     # Lecture timeline component
├── hooks/               # Custom React hooks
│   └── useCytoscape.js  # Cytoscape.js integration
├── styles/              # CSS modules and styling
├── utils/               # Utility functions
│   └── voiceRecognition.js # Voice recognition setup
├── App.js               # Main application component
├── MindMap.jsx          # Core mind mapping functionality
└── theme.js             # Material-UI theme configuration
```

## Key Features in Detail

### Voice Recognition System
- Continuous speech recognition with real-time transcription
- Keyword detection and automatic node creation
- Support for multiple languages (currently configured for English)
- Error handling and fallback mechanisms

### Mind Map Visualization
- Interactive graph with zoom, pan, and selection capabilities
- Custom node styling with color coding
- Edge creation and management
- Responsive design for various screen sizes

### AI Integration
- Google Gemini API for intelligent content generation
- Context-aware descriptions for detected keywords
- Artist information enrichment
- Real-time AI processing

