"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the popup every time the component makes a fresh mount (landing or refreshing)
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notice</DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-500 dark:text-gray-400">
            Currently only SPM Sejarah Tingkatan 5 is available.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
