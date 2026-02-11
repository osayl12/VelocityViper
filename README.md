# Velocity Viper  🚗🎮

A simple browser racing game (menu + in-game) built with **HTML/CSS/JavaScript** and deployed as a **static website** using **Nginx + Docker**.

## Live Pages
- Menu: `/menugame/menu.html`
- Game: `/ingame/game.html`

## Tech Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Web server: Nginx (static hosting)
- DevOps: Docker, Docker Compose, GitHub Actions (CI)

## Project Structure
```
velocityviper/
├── site/
│   ├── menugame/
│   │   ├── menu.html
│   │   ├── menu.css
│   │   └── menu.js
│   ├── ingame/
│   │   ├── game.html
│   │   ├── game.css
│   │   └── java.js
│   ├── gamepics/        # images (cars, backgrounds, etc.)
│   ├── menuaudio/       # audio files
│   └── fonts/           # custom fonts
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## How to Run (Docker)

### Option 1: Docker Compose (recommended)
```bash
docker compose up --build
```

Then open:
- http://localhost:8082/menugame/menu.html
- http://localhost:8082/ingame/game.html

### Option 2: Docker directly
```bash
docker build -t velocity-viper .
docker run --rm -p 8082:80 velocity-viper
```

## CI (GitHub Actions)

This repository includes a CI workflow that:
1. Builds the Docker image
2. Runs the container
3. Performs a smoke test by requesting:
   - `/menugame/menu.html`
   - `/ingame/game.html`

Workflow file:
- `.github/workflows/ci.yml`

## Notes
- The game stores the best score locally using `localStorage`.
- This project is a **standalone application** and can be deployed independently.

## License
For educational use.
