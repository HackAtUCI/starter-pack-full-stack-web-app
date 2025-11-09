import React from "react";
import GoogleSearchBar from "@/components/GoogleSearchBar";

const Search = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Politics, Simply Put: "Why Should I Care?"</h1>
          <p className="text-sm text-gray-600">Find issues that affect <strong>you</strong></p>
        </div>

        <GoogleSearchBar />
      </div>
    </div>
  );
};

export default Search;