# 🎉 Group Event Planner

A sleek, SPA built with **Next.js**, **TypeScript**, and **Tailwind CSS v3** to help small groups seamlessly plan and coordinate events.

## 🚀 Features

- 📅 Interactive shared calendar  
- 📌 Add and suggest event ideas  
- ✅ RSVP tracker with real-time counts  
- 🔔 Friendly automatic reminders  
- ✨ Clean, modern, professional UI  
- 📱 Fully responsive design  
- 🎨 Smooth animations using Framer Motion  

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v3](https://tailwindcss.com/docs/installation)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [date-fns](https://date-fns.org/)
- [Lucide Icons](https://lucide.dev/)
- [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hemashree21/event-planner.git
cd event-planner
```

### 2. Install Dependencies

Use the commands below to set up Tailwind v3 and all required libraries:

```bash
# Install Tailwind CSS v3
npm install -D tailwindcss@3 postcss autoprefixer

# Install animation & icons plugin
npm install -D tailwindcss-animate lucide-react

# Install additional libraries
npm install framer-motion recharts date-fns
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎨 Tailwind CSS Setup

Ensure your `globals.css` contains:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
