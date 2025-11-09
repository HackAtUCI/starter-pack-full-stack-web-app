import { Button, Dialog, DialogPanel, DialogTitle, Portal } from '@headlessui/react'
import { useState } from 'react'


export const Modal = () => {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      <Portal>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} static className="z-[9999]">
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">Topic</DialogTitle>
            <p>info info info info.</p>
            <div className="flex gap-4">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsOpen(false)}>Deactivate</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      </Portal>
    </div>
  )
}

export default Modal;