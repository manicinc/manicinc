// src/components/Header.tsx
import React from "react";
import { Nav } from "./Nav";

// Keep Header simple - Nav handles its own fixed positioning/styling.
export const Header = () => {
  return (
    <header> {/* Semantic tag is good */}
      <Nav />
    </header>
  );
};

// Optional: export default Header;