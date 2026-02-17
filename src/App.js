import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Blog from "./Blog";
import TrackYourItem from "./track-your-item";
import About from "./About";
import FAQ from "./FAQ";
import { useEffect } from "react";

function ExternalRedirect({ url }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track-your-item" element={<TrackYourItem />} />
      <Route path="/blog/*" element={<Blog />} /> {/* ← THIS */}
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<ExternalRedirect url="https://docs.google.com/forms/d/e/1FAIpQLSfMZDY_D9gO2JPLYAnIeEqyyYeZI2VXDTnR12L4ihbz5hYwIA/viewform" />} />
    </Routes>
  );
}

