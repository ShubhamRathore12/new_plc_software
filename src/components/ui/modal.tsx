"use client";

import { Dialog } from "@headlessui/react";
import { Fragment } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <button onClick={onClose} className="absolute top-2 right-2">
            Close
          </button>
          {children}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
