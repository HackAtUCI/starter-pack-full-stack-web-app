
import React from "react";
import styles from "./Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import Card from "@/components/Card";


const Modal = ({ setIsOpen }) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Glossary</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
           <Card/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;