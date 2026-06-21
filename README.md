# Kurt Michael Mirafelix - Portfolio

This repository contains the source code for my personal portfolio website, designed to showcase my projects, skills, and professional experience as a developer. The design emphasizes a clean, premium aesthetic with smooth animations and responsive layouts, originally inspired by a premium Figma design.

This is my very first iteration of my portfolio website, if you do have any suggestions, please do let me know! I'm open to any feedback and suggestions. I'm a beginner when it comes to web development, but I'm eager to learn and improve. Thank you!

## Tech Stack

The portfolio is built with modern web technologies, focusing on performance, accessibility, and maintainability:

* **Framework:** React 18 with Vite for fast, optimized builds.
* **Language:** TypeScript for static typing and robust code quality.
* **Styling:** Tailwind CSS 4 for utility-first styling and responsive design.
* **UI Components:** Radix UI primitives and shadcn/ui for accessible, unstyled component foundations.
* **Icons:** Lucide React for clean, consistent iconography.
* **Animations & Scrolling:**
  * Framer Motion for complex, fluid micro-interactions and layout animations.
  * Lenis for smooth, momentum-based scrolling experiences.
* **Forms & Contact:** React Hook Form for form state management and EmailJS for handling contact form submissions directly from the client side.

## Features

* **Responsive Design:** Fully optimized for all device sizes, from mobile phones to large desktop monitors.
* **Smooth Scrolling & Animations:** Custom scrolling behavior and page transitions to provide a premium user experience.
* **Interactive UI Elements:** Custom cursor, magnetic buttons, and hover effects.
* **Project Showcase:** Detailed sections highlighting past work, technologies used, and direct links to live demos or repositories.
* **Contact Integration:** Functional contact form that sends messages directly to my email using EmailJS.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

* Node.js (version 18 or higher recommended)
* npm or your preferred package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/coco1oco/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env` and fill in your EmailJS credentials to enable the contact form.

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   To access it from other devices on your local network, run:

   ```bash
   npm run dev -- --host
   ```

5. Build for production:

   ```bash
   npm run build
   ```

## Contact

* **Email:** <kmirafelix@gmail.com>
* **LinkedIn:** [kurt-michael-mirafelix](https://www.linkedin.com/in/kurt-michael-mirafelix)
* **GitHub:** [coco1oco](https://github.com/coco1oco)
