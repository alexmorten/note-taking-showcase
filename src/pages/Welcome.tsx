import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.scss";
export default function Welcome() {
  return (
    <div className="Welcome">
      <section className="section1">
        <h1>What is this?</h1>
        <p>
          This is a simple, light-weight{" "}
          <a
            className="inherit-color"
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Markdown"
          >
            markdown
          </a>{" "}
          note taking app.
        </p>
        <p>
          It stores everything locally in your browser and you can still use it
          without an internet connection.
        </p>
      </section>
      <section className="section2">
        <h2>Why?</h2>
        <p>This is mostly an excercise for myself.</p>
      </section>
      <section className="section3">
        <h2>How?</h2>
        <p>
          Go to{" "}
          <Link className="inherit-color" to="/notes">
            your notes
          </Link>{" "}
        </p>
      </section>
      <section className="section4">
        <h2>Show me the code!</h2>
        <p>
          Just have a look at the{" "}
          <a
            className="inherit-color"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/alexmorten/note-taking-showcase"
          >
            repo
          </a>
        </p>
      </section>
    </div>
  );
}
