import Card from "@/components/Card";

import React, { useState } from "react";
import ModalV2 from "@/components/ModalV2";

const Results = () => {
      const [isOpen, setIsOpen] = useState(false);
    return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Topics</h1>
          <p className="text-sm text-gray-600">Topics listed below</p>
        </div>


    <main>
      <button onClick={() => setIsOpen(true)}>
        <Card/>
        View Article
      </button>
      {isOpen && <ModalV2 setIsOpen={setIsOpen} />}
    </main>
          </div>
    </div>
  );
};
<>
<div>
    <Card /> 

</div>
</>


export default Results;
