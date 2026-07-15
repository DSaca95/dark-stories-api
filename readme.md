# Dark Stories API

A **Dark Stories** egy minimalista, gyors és rugalmas REST API, amely a Dark Stories (fekete történetek) társasjáték feladványait kezeli és szolgálja ki. A projekt egy különálló frontend alkalmazással (klienssel) való együttműködésre lett tervezve.

## 🚀 Főbb jellemzők

* **Gyors szűrés:** Keresés cím, feladvány szövege vagy akár konkrét ID alapján.
* **Kategória & Nehézség szűrők:** Szűkítsd a találatokat téma (`tragic`, `mystery`) vagy nehézség (`easy`, `medium`, `hard`) szerint.
* **Rendezési opciók:** Támogatja a növekvő vagy csökkenő rendezést bármelyik adatmező alapján (pl. ABC sorrend, ID sorrend).
* **CORS engedélyezve:** Problémamentes kommunikáció a helyi vagy éles frontend környezetekkel.

---

## 🛠️ Technológiai stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Csomagkezelő:** npm
* **Adatformátum:** JSON (fájlalapú adatbázis)

---

## 💻 Telepítés és használat

### 1. Előfeltételek
Győződj meg róla, hogy a [Node.js](https://nodejs.org/) telepítve van a gépeden.

### 2. Projekt klónozása és függőségek telepítése
```bash
# Lépj be a projekt könyvtárába
cd dark-stories-api

# Telepítsd a szükséges csomagokat
npm install