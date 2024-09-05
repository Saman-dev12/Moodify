import React, { useState, ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  trigger: ReactNode;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  onSave: () => void;
  saveButtonText: string;
}

export default function Modal({ trigger, title, icon, content, onSave, saveButtonText }: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    onSave();
    handleCloseModal();
  };

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setShowModal(true),
      })}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black bg-opacity-70"
              style={{
                background: "radial-gradient(circle at center, rgba(29,185,84,0.1) 0%, rgba(0,0,0,0.8) 100%)",
              }}
            />
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-full max-w-md mx-auto"
            >
              <div className="relative flex flex-col w-full bg-gradient-to-br from-[#121212] to-[#1a1a1a] border border-[#282828] rounded-lg shadow-2xl outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-[#282828] rounded-t">
                  <h3 className="text-2xl font-semibold text-white flex items-center">
                    {icon && <span className="mr-2">{icon}</span>}
                    {title}
                  </h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-[#1DB954] transition-colors duration-200"
                    onClick={handleCloseModal}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                <div className="relative p-6 flex-auto">
                  {content}
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-[#282828] rounded-b">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-[#1DB954]"
                    type="button"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSaveChanges}
                  >
                    {saveButtonText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}