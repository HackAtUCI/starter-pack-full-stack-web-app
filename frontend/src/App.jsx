import { useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RandomItem from "@/components/RandomItem";
import { Routes, Route, Link } from "react-router-dom";
import React from 'react'
import GoogleSearchBar from '@/components/GoogleSearchBar';

function App() {
  return (
    <div className="App">
      <GoogleSearchBar />
    </div>
  )
}

export default App();
