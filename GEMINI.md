# Project Overview

This is a Next.js project bootstrapped with `create-next-app` and configured for use with v0.app, a design-to-code tool. The project is deployed on Vercel.

The main feature of the project is a complex, scroll-based hero animation built with GSAP (GreenSock Animation Platform) and ScrollTrigger. The animation is highly responsive and uses a dedicated configuration file to manage different screen sizes.

## Technologies

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animation:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/)

## Building and Running

To get the project up and running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the development server at `http://localhost:3000`.

3.  **Build for production:**
    ```bash
    npm run build
    ```
    This will create an optimized production build in the `.next` directory.

4.  **Start the production server:**
    ```bash
    npm run start
    ```
    This will start a production server.

## Development Conventions

*   **Code Style:** The project uses ESLint for code linting. Run `npm run lint` to check for linting errors.
*   **Component-Based Architecture:** The UI is built with React components, located in the `components` directory.
*   **Hooks for Logic:** Business logic and complex interactions are encapsulated in custom hooks, located in the `hooks` directory.
*   **Configuration-Driven Animations:** The hero animation is configured in `lib/hero-config.ts`, which allows for easy adjustments and responsive control.
*   **Separation of Concerns:** The animation logic is separated from the component markup, with the `useHeroAnimation` hook managing the GSAP timeline and the `HeroAnimation` component handling the rendering.
