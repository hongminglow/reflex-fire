# 🎯 Reflex Fire - Aim Trainer Game

A fast-paced reflex shooter game built with React, Vite, and Framer Motion. Test your reaction speed by shooting skeleton targets before they disappear!

## 🎮 Game Features

- **Dynamic Target System**: Skeleton targets spawn randomly with varying sizes and durations
- **Combo System**: Build combos for bonus points - miss a target and lose your combo
- **Progressive Difficulty**: Game gets harder as you level up with faster spawns and shorter target durations
- **Lives System**: Start with 3 lives (hearts) - lose one for each missed target
- **Score Tracking**: High score saved in localStorage
- **Sound Effects**: 
  - Procedurally generated gunshot, hit, and miss sounds using Web Audio API
  - Atmospheric background music with layered drones
- **Visual Effects**: 
  - Custom crosshair that follows your cursor
  - Animated targets with progress rings
  - Floating score indicators
  - Smooth animations with Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hongminglow/reflex-fire.git
cd reflex-fire
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env.local` file for Base44 integration:
```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## 🎯 How to Play

1. Click **START GAME** to begin
2. Skeleton targets will appear randomly on screen
3. Click targets before they disappear to score points
4. Build combos by hitting consecutive targets
5. Faster hits = more points
6. Miss a target = lose a life and reset combo
7. Game ends when you lose all 3 lives

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling
- **Web Audio API** - Procedural sound generation
- **React Router** - Routing
- **TanStack Query** - Data fetching (for Base44 integration)

## 📦 Project Structure

```
reflex-fire/
├── src/
│   ├── components/
│   │   ├── game/          # Game components
│   │   │   ├── CrossHair.jsx
│   │   │   ├── GameHUD.jsx
│   │   │   ├── Target.jsx
│   │   │   ├── StartScreen.jsx
│   │   │   ├── GameOverScreen.jsx
│   │   │   └── ...
│   │   └── ui/            # shadcn/ui components
│   ├── lib/
│   │   ├── sounds.js      # Web Audio API sound engine
│   │   └── utils.js       # Utility functions
│   ├── pages/
│   │   └── Game.jsx       # Main game logic
│   └── App.jsx
├── public/
│   └── favicon.svg        # Gun icon
└── package.json
```

## 🎨 Customization

### Adjust Difficulty

Edit `src/pages/Game.jsx`:

```javascript
function getSpawnInterval(level) {
  return Math.max(600, 2000 - level * 150); // Adjust spawn rate
}

function getTargetDuration(level) {
  return Math.max(800, 2500 - level * 180); // Adjust target lifetime
}
```

### Change Colors

Edit `src/index.css` to modify the color scheme using CSS variables.

### Modify Sounds

Edit `src/lib/sounds.js` to adjust sound effects and background music parameters.

## 🔧 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
