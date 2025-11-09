import Card from "@/components/Card";
import Modal from "@/components/Modal";

import React, { useState } from "react";
import ModalV2 from "@/components/ModalV2";

const Results = () => {
      const [isOpen, setIsOpen] = useState(false);
    return (
    <main>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      {isOpen && <ModalV2 setIsOpen={setIsOpen} />}
    </main>
  );
};
<>
<div>
    <Card /> 

</div>
</>


export default Results;
