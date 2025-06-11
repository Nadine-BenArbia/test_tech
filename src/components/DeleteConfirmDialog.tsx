"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  title: string
  description?: string
  onConfirm: () => void
  isLoading?: boolean
  children?: React.ReactNode
}

export function DeleteConfirmDialog({
  title,
  description,
  onConfirm,
  isLoading = false,
  children,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    console.log("Delete confirmation triggered for:", title) // Debug log
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-red-600 hover:border-red-300 hover-scale"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <div className="flex items-center gap-3 animate-slide-in-left">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-bounce-in">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left animate-slide-up">Delete Post</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left mt-2 animate-fade-in">
            Are you sure you want to delete <strong>"{title}"</strong>?
            {description && <span className="block mt-2 text-sm text-gray-600">{description}</span>}
            <span className="block mt-2 text-sm font-medium text-red-600 ">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 animate-slide-up">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="hover-scale">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 btn-animate"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
