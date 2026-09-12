import React from "react";

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="LDU home">
        <span>LDU</span>
        <small>LLC</small>
      </a>
      <nav aria-label="Primary">
        <a href="#position">Position</a>
        <a href="#house">House</a>
        <a href="#method">Method</a>
        <a href="#services">What we do</a>
        <a href="#proof">Proof</a>
        <a href="#team">Who we are</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
