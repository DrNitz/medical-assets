import os
import json

REPO_URL = "https://raw.githubusercontent.com/DrNitz/medical-assets/main"
FOLDER_NAME = "Med_img"
OUTPUT_FILE = "custom_med_data.json"

def generate_json():
    if not os.path.exists(FOLDER_NAME):
        os.makedirs(FOLDER_NAME)
        print(f"Created folder '{FOLDER_NAME}'.")

    images = []
    valid_extensions = ('.png', '.jpg', '.jpeg', '.svg', '.webp')

    for filename in sorted(os.listdir(FOLDER_NAME)):
        if filename.lower().endswith(valid_extensions):
            file_id = os.path.splitext(filename)[0]
            title = file_id.replace('-', ' ').replace('_', ' ').title()
            tags = [tag.lower() for tag in title.split()]

            images.append({
                "id": f"custom_{file_id}",
                "title": title,
                "tags": tags,
                "url": f"{REPO_URL}/{FOLDER_NAME}/{filename}",
                "category": "Custom Images"
            })

    data = {
        "categories": [
            {
                "name": "Custom Images",
                "images": images
            }
        ]
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Generated {OUTPUT_FILE} with {len(images)} images.")

if __name__ == "__main__":
    generate_json()
