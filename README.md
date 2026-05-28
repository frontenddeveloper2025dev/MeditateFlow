# Serenity 🧘‍♀️✨

![Vista previa Serenity](https://raw.githubusercontent.com/frontenddeveloper2025dev/MeditateFlow/refs/heads/main/meditate.png)

## Descripción General

**Serenity** es una aplicación moderna de meditación y mindfulness desarrollada con **React, Express y TypeScript**.  
La aplicación permite crear experiencias de meditación personalizadas mediante sesiones guiadas de respiración, sonidos ambientales, campanas de intervalo y seguimiento del progreso.

Los usuarios pueden personalizar:
- Duración de la meditación
- Patrones de respiración
- Sonidos ambientales
- Campanas de intervalo
- Objetivos diarios de meditación

La aplicación también registra:
- Historial de sesiones
- Objetivos diarios
- Rachas de meditación
- Tiempo total meditado

Diseñada con una interfaz limpia y responsiva, Serenity busca ofrecer una experiencia relajante, accesible e inmersiva.

---

# ✨ Características

- 🫁 Animaciones guiadas de respiración
- 🌧 Sonidos ambientales (Lluvia, Océano, Bosque y Viento)
- 🔔 Campanas de meditación por intervalos
- ⏱ Temporizador y seguimiento de sesiones
- 📊 Estadísticas y rachas de meditación
- 🎯 Objetivos diarios
- 📱 Diseño totalmente responsivo
- 🎨 Interfaz moderna construida con Radix UI + Tailwind CSS

---

# 🖥 Tecnologías Utilizadas

## Frontend
- React 18
- TypeScript
- Vite
- Wouter
- Tailwind CSS
- Radix UI
- shadcn/ui
- TanStack Query

## Backend
- Node.js
- Express
- Drizzle ORM
- Arquitectura preparada para PostgreSQL

## Herramientas de Desarrollo
- TypeScript
- Vite
- Drizzle Kit
- ESLint
- PostCSS

---

# 🏗 Arquitectura del Sistema

## Arquitectura Frontend

- Aplicación SPA (Single Page Application)
- Routing ligero con **Wouter**
- Estado local manejado con React Hooks
- Estado del servidor gestionado con **TanStack Query**
- Diseño responsivo con **Tailwind CSS**
- Componentes accesibles utilizando **Radix UI**

---

## Arquitectura Backend

- API REST desarrollada con **Express**
- Almacenamiento en memoria para desarrollo
- Estructura lista para integración con base de datos mediante **Drizzle ORM**
- Gestión de sesiones y preferencias del usuario

---

# 🗄 Esquema de Base de Datos

La aplicación está preparada para integrarse con PostgreSQL mediante esquemas predefinidos para:

- `users`
- `meditation_sessions`
- `user_preferences`

Drizzle ORM proporciona:
- Consultas tipadas
- Validación de esquemas
- Soporte para migraciones

---

# 🎧 Funciones de Audio

Serenity incluye un sistema personalizado de manejo de audio con:

- Sonidos ambientales de fondo
- Sincronización con respiración guiada
- Campanas de meditación
- Integración con Web Audio API

Sonidos disponibles:
- Lluvia
- Océano
- Bosque
- Viento

---

# 📈 Seguimiento de Meditación

Los usuarios pueden monitorear:
- Minutos totales meditados
- Objetivos diarios
- Rachas de meditación
- Historial de sesiones

---

# 🚀 Primeros Pasos

## Instalar dependencias

```bash
npm install
```

## Ejecutar servidor de desarrollo

```bash
npm run dev
```

## Compilar para producción

```bash
npm run build
```

---

# 📂 Estructura del Proyecto

```bash
client/        # Frontend en React
server/        # Backend con Express
shared/        # Tipos y esquemas compartidos
public/        # Recursos estáticos
```

---

# 🌿 Filosofía de Diseño

Serenity fue diseñado para crear una experiencia digital relajante mediante:
- Interfaces minimalistas
- Animaciones suaves
- Alta legibilidad
- Jerarquía visual clara
- Interacciones conscientes y accesibles

---

# 🔮 Futuras Mejoras

- Autenticación de usuarios
- Integración con base de datos en la nube
- Meditaciones guiadas con voz
- Seguimiento emocional y de estado de ánimo
- Recomendaciones mediante IA
- Soporte offline
- Aplicación móvil

---

# 📸 Vista Previa

![Serenity App](https://raw.githubusercontent.com/frontenddeveloper2025dev/MeditateFlow/refs/heads/main/meditate.png)

---

# 👩‍💻 Autor

Creado por **Índigo / Alejandra Bárcena**  
Frontend Developer • UX/UI • Creative Technologist

