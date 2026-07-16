# Dark Stories API

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![REST API](https://img.shields.io/badge/API-REST-blue)
![JSON](https://img.shields.io/badge/Database-JSON-orange)
![Status](https://img.shields.io/badge/Status-Online-success)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A lightweight REST API serving detective-style **Dark Stories** ("Black Stories") riddle cards with advanced searching, filtering, sorting and random story generation.

---

# 🌍 Language / Nyelv

* [🇭🇺 Magyar](#-magyar)
* [🇬🇧 English](#-english)

---

# 🇭🇺 Magyar

## 📖 Áttekintés

A **Dark Stories API** egy könnyű, gyors és rugalmas REST API, amely a népszerű **Dark Stories / Black Stories** stílusú logikai-detektív feladványokat szolgálja ki JSON formátumban.

A projekt elsősorban portfólió célból készült, ugyanakkor bármilyen frontend (React, Vue, Angular, mobilalkalmazás vagy Vanilla JavaScript) számára könnyedén felhasználható backendként.

---

## ✨ Főbb jellemzők

✅ REST API

✅ JSON alapú kommunikáció

✅ Keresés címben és feladványban

✅ Szűrés kategória alapján

✅ Szűrés nehézség alapján

✅ Több szűrő kombinálása

✅ Dinamikus rendezés

✅ Véletlenszerű történet

✅ Egyedi történet lekérése ID alapján

✅ CORS támogatás

✅ Adatbázis nélküli, egyszerű JSON adattárolás

---

## 🌐 Live API

Az API jelenleg Renderen fut:

**https://dark-stories-api.onrender.com/api/stories**

### ⚠️ Render Cold Start

A projekt a Render ingyenes csomagját használja.

Ha körülbelül 15 percig nem érkezik kérés, a szolgáltatás "elalszik", ezért az első kérés akár **30–50 másodpercet** is igénybe vehet.

Az első kérés után minden további válasz normál sebességgel érkezik.

---

## 🛠️ Technológiai stack

| Technológia | Leírás                 |
| ----------- | ---------------------- |
| Node.js     | JavaScript Runtime     |
| Express.js  | Backend Framework      |
| npm         | Package Manager        |
| JSON        | Fájl alapú adattárolás |
| Render      | Cloud Hosting          |

---

## 📁 Projekt struktúra

```text
dark-stories-api
│
├── data
│   └── stories.json
│
├── routes
│
├── controllers
│
├── middleware
│
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Telepítés

### Előfeltételek

* Node.js
* npm

### Repository klónozása

```bash
git clone https://github.com/yourusername/dark-stories-api.git
```

### Függőségek telepítése

```bash
npm install
```

### Szerver indítása

```bash
npm start
```

Alapértelmezett cím:

```
http://localhost:3000
```

---

## 📊 Data Schema

Minden történet a következő struktúrát használja:

```json
{
  "id": 1,
  "title": "The Locked Room",
  "riddle": "A man is found dead in a locked room...",
  "solution": "He committed suicide.",
  "category": "mystery",
  "difficulty": "medium",
  "hints": [
    "No one entered the room.",
    "The window was locked."
  ]
}
```

---

# 🛰 API Dokumentáció

## Base URL

Local

```
http://localhost:3000
```

Production

```
https://dark-stories-api.onrender.com
```

---

# GET /

Health Check

Response

```text
Dark Stories API - online & working!
```

---

# GET /api/stories

Összes történet lekérése.

### Paraméterek

| Paraméter  | Leírás                           |
| ---------- | -------------------------------- |
| search     | keresés címben vagy feladványban |
| category   | kategória                        |
| difficulty | nehézség                         |
| sortBy     | rendezési mező                   |
| order      | asc vagy desc                    |

Példa

```
GET /api/stories?category=tragic&difficulty=hard
```

---

# GET /api/stories/random

Véletlenszerű történet.

Példa válasz

```json
{
  "id": 8,
  "title": "...",
  "category": "tragic"
}
```

---

# GET /api/stories/:id

ID alapján lekérés.

Példa

```
GET /api/stories/5
```

---

## ❌ Hibák

404

```json
{
  "error": "Story not found."
}
```

500

```json
{
  "error": "Internal server error."
}
```

---

## 📌 Példák

### Keresés

```
GET /api/stories?search=knife
```

### Kategória

```
GET /api/stories?category=mystery
```

### Nehézség

```
GET /api/stories?difficulty=hard
```

### Rendezés

```
GET /api/stories?sortBy=title&order=asc
```

### Összetett lekérdezés

```
GET /api/stories?category=tragic&difficulty=medium&sortBy=title&order=desc
```

---

## 🚀 Roadmap

* [x] REST API
* [x] JSON adatbázis
* [x] Keresés
* [x] Szűrés
* [x] Rendezés
* [x] Random endpoint
* [ ] Pagination
* [ ] CRUD végpontok
* [ ] Swagger dokumentáció
* [ ] Rate limiting
* [ ] Authentication

---

## 📊 Projekt Statisztikák

• 200 detektív történet
• 2 támogatott nyelv
• 400 honosított történetváltozat
• 600+ mesélő tipp
• 5 API végpont
• Speciális keresés és szűrés
• Véletlenszerű történetgenerálás
• Nincs külső adatbázis

---

## 🤝 Hozzájárulás

Pull Requesteket és Issue-kat szívesen fogadok.

---

## 📄 Licenc

MIT License

---

# 🇬🇧 English

## 📖 Overview

Dark Stories API is a lightweight and flexible REST API built for serving detective-style riddle cards inspired by the popular **Dark Stories / Black Stories** party game.

The project was created as a portfolio backend application while remaining fully reusable in real-world frontend applications such as React, Vue, Angular, mobile apps or Vanilla JavaScript.

---

## ✨ Features

✅ RESTful API

✅ JSON responses

✅ Search by title and riddle

✅ Category filtering

✅ Difficulty filtering

✅ Multiple filter combinations

✅ Dynamic sorting

✅ Random story endpoint

✅ Story lookup by ID

✅ CORS enabled

✅ Lightweight JSON database

---

## 🌐 Live API

```
https://dark-stories-api.onrender.com/api/stories
```

### ⚠️ Render Cold Start

This project is hosted on Render's free tier.

If no requests are received for approximately 15 minutes, the service automatically spins down.

The first request may therefore take **30–50 seconds** while the server wakes up.

Subsequent requests respond normally.

---

## 🛠 Technology Stack

| Technology | Description        |
| ---------- | ------------------ |
| Node.js    | Runtime            |
| Express.js | Framework          |
| npm        | Package Manager    |
| JSON       | File-based storage |
| Render     | Cloud Hosting      |

---

## 📁 Project Structure

```text
dark-stories-api
│
├── data
│   └── stories.json
│
├── routes
├── controllers
├── middleware
│
├── app.js
├── package.json
└── README.md
```

---

## ⚙ Installation

### Requirements

* Node.js
* npm

Clone repository

```bash
git clone https://github.com/yourusername/dark-stories-api.git
```

Install dependencies

```bash
npm install
```

Run server

```bash
npm start
```

Default URL

```
http://localhost:3000
```

---

## 📊 Data Schema

```json
{
  "id": 1,
  "title": "The Locked Room",
  "riddle": "A man is found dead in a locked room...",
  "solution": "He committed suicide.",
  "category": "mystery",
  "difficulty": "medium",
  "hints": [
    "No one entered.",
    "The window was locked."
  ]
}
```

---

# 🛰 API Documentation

## Base URL

Local

```
http://localhost:3000
```

Production

```
https://dark-stories-api.onrender.com
```

---

## GET /

Health check endpoint.

Response

```text
Dark Stories API - online & working!
```

---

## GET /api/stories

Returns every story matching the supplied query parameters.

### Query Parameters

| Parameter  | Description               |
| ---------- | ------------------------- |
| search     | Search in title or riddle |
| category   | Filter by category        |
| difficulty | Filter by difficulty      |
| sortBy     | Sort field                |
| order      | asc or desc               |

---

### Example

```
GET /api/stories?category=tragic&difficulty=hard
```

---

## GET /api/stories/random

Returns one random story.

Example

```json
{
  "id": 4,
  "title": "...",
  "category": "mystery"
}
```

---

## GET /api/stories/:id

Returns one story by its ID.

Example

```
GET /api/stories/5
```

---

## Error Responses

404

```json
{
  "error": "Story not found."
}
```

500

```json
{
  "error": "Internal server error."
}
```

---

## Examples

Search

```
GET /api/stories?search=knife
```

Category

```
GET /api/stories?category=tragic
```

Difficulty

```
GET /api/stories?difficulty=medium
```

Sorting

```
GET /api/stories?sortBy=title&order=asc
```

Combined

```
GET /api/stories?category=mystery&difficulty=hard&sortBy=title&order=desc
```

---

## 🚀 Roadmap

* [x] REST API
* [x] JSON storage
* [x] Search
* [x] Filtering
* [x] Sorting
* [x] Random endpoint
* [ ] Pagination
* [ ] CRUD endpoints
* [ ] Swagger documentation
* [ ] Rate limiting
* [ ] Authentication

---

## 📊 Project Statistics

• 200 detective stories
• 2 fully supported languages
• 400 localized story versions
• 600+ host hints
• 5 API endpoints
• Advanced search & filtering
• Random story generation
• Zero external database

---

## 🤝 Contributing

Contributions, Issues and Pull Requests are always welcome.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Sándor Dalmadi**

Graphic Designer • Frontend Developer

Built as a portfolio project demonstrating backend development with **Node.js** and **Express.js** while providing a reusable REST API for modern frontend applications.
