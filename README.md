# Infinite World

Infinite World is an immersive, procedurally generated 3D environment created using WebGL with Three.js. This project aims to provide a limitless, expansive world that continuously evolves as users explore it. It's designed primarily for exploration and experimentation, showcasing the power of procedural generation techniques in a 3D space. Whether you're a developer interested in how such worlds are built, or simply someone who loves endless virtual environments, Infinite World offers a beautiful sandbox to get lost in.

![Infinite World Screenshot](public/social/share-1200x630.png?raw=true "Infinite World Screenshot")

## Features

- **Procedural Terrain Generation**: The landscape is dynamically generated, ensuring that no two regions are the same, giving a unique experience each time you explore.
- **Infinite Exploration**: The world extends infinitely, making every journey distinct and providing endless opportunities for discovery.
- **WebGL and Three.js**: Built using WebGL and Three.js, Infinite World demonstrates how complex 3D environments can run efficiently in the browser.
- **No Purpose, Just Fun**: The project is purely for fun and educational purposes, with no set objectives or game mechanics—just a space to explore, learn, and enjoy.

## Getting Started

Follow the instructions below to set up and run Infinite World locally:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/download/) installed on your system.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/barkerbg001/echo-valley
   ```
2. Navigate into the project directory:
   ```
   cd infinite-world-master
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Project

To start the development server:

```
npm run dev
```

This command will start a local server and you can access Infinite World by opening your browser and navigating to `http://localhost:3000`.

## File Structure

- **index.html**: The main HTML file that serves as the entry point.
- **public/**: Contains static assets such as images and styles.
- **sources/**: Contains the JavaScript code used to generate and manage the 3D world.
- **vite.config.js**: The configuration file for Vite, which is used as the build tool for the project.

## Technologies Used

- **Three.js**: A powerful 3D graphics library that runs in the browser.
- **Vite**: A fast build tool that provides instant server start and blazing fast HMR.
- **WebGL**: The technology that enables rendering of 3D graphics within browsers.

## Contributing

Contributions are welcome! If you have ideas on how to improve Infinite World, feel free to submit a pull request or open an issue.

## License

This project is open source and available under the [MIT License](LICENSE).

Enjoy exploring!
