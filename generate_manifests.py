#!/usr/bin/env python3
"""
generate_manifests.py
=====================
Zoe Manalo Portfolio — Manifest Generator

Run this from the ROOT of the project folder any time you:
  - Add new photos to a project
  - Create a new project folder
  - Rename or remove photos

Usage:
    python3 generate_manifests.py

What it does:
    Scans every subfolder inside images/ and writes a manifest.json
    listing all image files. The viewer.js uses this to load photos.

Supported image formats: .jpg .jpeg .png .webp .gif
"""

import os
import json

# ── Config ────────────────────────────────────────────────────────
IMAGES_ROOT = "images"           # relative to project root
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
# ─────────────────────────────────────────────────────────────────


def find_project_folders(root):
    """Walk images/ and return every folder that contains image files."""
    folders = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Sort so manifest order is alphabetical / consistent
        dirnames.sort()
        images = sorted([
            f for f in filenames
            if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS
        ])
        if images:
            folders.append((dirpath, images))
    return folders


def build_manifest(dirpath, filenames):
    """Build the manifest dict for a folder."""
    # Convert filesystem path to web-absolute URL path
    # e.g. images/collaborations/floor13 -> /images/collaborations/floor13
    web_dir = "/" + dirpath.replace("\\", "/")

    images = [f"{web_dir}/{fname}" for fname in filenames]
    return {"images": images}


def write_manifest(dirpath, manifest):
    """Write manifest.json into the folder."""
    out_path = os.path.join(dirpath, "manifest.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    return out_path


def main():
    if not os.path.isdir(IMAGES_ROOT):
        print(f"ERROR: '{IMAGES_ROOT}' folder not found.")
        print("Make sure you're running this from the project root folder.")
        print(f"  Expected: ./{IMAGES_ROOT}/")
        return

    folders = find_project_folders(IMAGES_ROOT)

    if not folders:
        print(f"No image files found inside '{IMAGES_ROOT}/'.")
        return

    print(f"\nGenerating manifests...\n")

    total_images = 0
    for dirpath, filenames in folders:
        manifest = build_manifest(dirpath, filenames)
        out_path = write_manifest(dirpath, manifest)
        count = len(filenames)
        total_images += count
        # Pretty relative path for display
        display = dirpath.replace("\\", "/")
        print(f"  ✓  {display}/manifest.json  ({count} image{'s' if count != 1 else ''})")

    print(f"\nDone. {total_images} images across {len(folders)} folder{'s' if len(folders) != 1 else ''}.\n")


if __name__ == "__main__":
    main()