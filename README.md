# WinApp - Aplicación de Apuestas Online

WinApp es una plataforma de apuestas en juegos online donde los jugadores se conectan según sus apuestas y compiten por premios en dinero real.

## 🎮 Características

- **Billetera Digital**: Depósitos y retiros con PayPal y transferencia bancaria
- **Matchmaking Automático**: Conecta jugadores con apuestas iguales
- **Múltiples Juegos**: Monopolio, Póker, Dados, Blackjack y más
- **Apuestas Variables**: Diferentes montos según el juego
- **Sistema de Comisiones**: Por retiros de fondos
- **Autenticación Segura**: JWT tokens
- **Dinero Real**: Transacciones reales integradas

## 📋 Estructura de Apuestas

### Apuestas Disponibles
- **$0.50** → Gana $1.00 (ganancia neta: $0.50)
- **$5.00** → Gana $10.00 (ganancia neta: $5.00)
- **$20.00** → Gana $40.00 (ganancia neta: $20.00)
- **$50.00** → Gana $100.00 (ganancia neta: $50.00)

### Comisiones de Retiro
- Retiro $5 → Comisión: $2
- Retiro $20 → Comisión: $5
- Retiro $50+ → Comisión: 10%

## 🏗️ Stack Tecnológico

### Backend
- Node.js + Express.js
- PostgreSQL
- Redis
- JWT Authentication
- PayPal SDK
- Socket.io

### Frontend
- React 18
- Redux Toolkit
- Tailwind CSS
- Socket.io Client

## 📁 Estructura del Proyecto

```
winapp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Instalación Rápida

Ver instrucciones en las carpetas `/backend` y `/frontend`

## 📄 Licencia

Propietaria - WinApp © 2024
