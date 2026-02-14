# 🚗 Velocity Viper

A retro-style browser racing game built with **HTML, CSS, and Vanilla
JavaScript**, fully containerized using **Docker** and deployed with
**Nginx**.

Live Demo: 👉 https://velocityviper.duckdns.org/menugame/menu.html

Repository: 👉 https://github.com/osayl12/VelocityViper

---

## 🎮 About The Project

Velocity Viper is a fully functional 2D top-down racing game that runs
directly in the browser.

The project demonstrates: - Frontend game logic (movement, collision
detection, animations) - DOM manipulation and event handling - State
management (fuel, health, score system) - Local storage usage (best
score tracking) - Audio controls and dynamic music switching - Static
site deployment using Nginx - Docker containerization - CI pipeline with
GitHub Actions

---

## 🛠 Tech Stack

Frontend: - HTML5 - CSS3 - Vanilla JavaScript (ES6)

Infrastructure: - Nginx - Docker - Docker Compose - GitHub Actions

---

## 🧩 Game Features

- Smooth car movement (horizontal, vertical, diagonal)
- Collision detection with enemy cars
- Health system
- Fuel consumption system
- Mystery box power-ups (heal / refuel)
- Score counter with best score saved in localStorage
- Background music with play/pause, volume control, track switching
- Animated environment (trees and moving road lines)
- Automatic redirection to menu on game over

---

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
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## How to Run (Docker)

docker compose up --build

Open: http://localhost:8082/

---

## 🐳 Run On Web

Link to the web: https://velocityviper.duckdns.org/

---

## CI (GitHub Actions)

T## ⚙️ CI

GitHub Actions workflow: - Builds Docker image - Runs container -
Performs smoke test on game pages

## Notes

- The game stores the best score locally using `localStorage`.

## License

For educational use.
