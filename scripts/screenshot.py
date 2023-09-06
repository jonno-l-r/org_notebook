#!/usr/bin/env python3

import tkinter as tk
from PIL import Image, ImageTk
import pyautogui
from datetime import datetime
import tempfile
import os
import argparse


class ImageCropGUI(tk.Canvas):
    def __init__(self, root, source_image_path, export_image_path, **kwargs):
        self.photo_image = ImageTk.PhotoImage(Image.open(source_image_path))
        self.root = root
        self.name = export_image_path
        
        super().__init__(
            root,
            width=self.photo_image.width(),
            height=self.photo_image.height(),
            **kwargs
        )

        self.start_x = 0
        self.start_y = 0
        self.stop_x = 0
        self.stop_y = 0
        self.offset_x = 0
        self.offset_y = 0        

        self.image = super().create_image(0, 0, anchor=tk.N+tk.W, image=self.photo_image)
        self.rectangle = super().create_rectangle(0,0,0,0, dash=(20,10), outline="red")
        super().pack()

        # Left mouse bindings
        super().bind("<Button-1>", self._startSelectorBox)
        super().bind("<B1-Motion>", self._drawSelectorBox)

        # Right mouse bindings
        super().bind("<Button-3>", self._saveCroppedImage)

        # Middle mouse bindings
        super().bind("<Button-2>", self._moveStart)
        super().bind("<B2-Motion>", self._moveDrag)
        super().bind("<ButtonRelease-2>", self._moveDone)

        # Root window bindings
        self.root.protocol(
            "WM_DELETE_WINDOW",
            lambda: exit(1)
        )


    def _startSelectorBox(self, event):
        self.start_x, self.start_y = (event.x, event.y)
        
        
    def _drawSelectorBox(self, event):
        self.stop_x, self.stop_y = (event.x, event.y)

        super().coords(
            self.rectangle,
            self.start_x, self.start_y, self.stop_x, self.stop_y
        )

        super().pack()


    def _moveStart(self, event):
        self.offset_x -= event.x
        self.offset_y -= event.y


    def _moveDrag(self, event):
        super().coords(
            self.image, self.offset_x+event.x, self.offset_y+event.y
        )
        super().pack()


    def _moveDone(self, event):
        self.offset_x += event.x
        self.offset_y += event.y


    def _saveCroppedImage(self, event):
        ImageTk.getimage(self.photo_image)\
               .crop(
                   [
                       self.start_x - self.offset_x,
                       self.start_y - self.offset_y,
                       self.stop_x - self.offset_x,
                       self.stop_y - self.offset_y
                   ]
               ).save(self.name)
        
        self.root.destroy()


if __name__ == "__main__":
    source_path = os.path.join(
        tempfile.gettempdir(),
        "temp_screenshot.png"
    )

    parser = argparse.ArgumentParser()
    parser.add_argument("export_path", default="image.png")
    args = parser.parse_args()
    
    pyautogui.screenshot().save(source_path)

    root = tk.Tk()
    image = ImageCropGUI(root, source_path, args.export_path)
    root.mainloop()
