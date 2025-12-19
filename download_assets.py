import os
import requests
import time

# Extended Automotive IDs
PHOTO_IDS = [
    "1503376780353-7e6692767b70", "1494976388531-d1058494cdd8", "1583121274602-3e2820c69888",
    "1555215695-3004980ad54e", "1525609004556-c46c7d6cf0a3", "1542281286-9e0a16bb7366",
    "1567818738068-18830c9ec58e", "1492144534655-ae79c964c9d7", "1618843479373-d060f03a1158",
    "1605559424843-9e4c228bf1c2", "1549317661-ff32fd3cd567", "1552519507-da3b142c6e3d",
    "1533473359331-0135ef1b58bf", "1517672651691-24622a91b550", "1526726538690-5bcbd117fc9d",
    "1502877338535-766e1452684a", "1493238545620-6920f065715d", "1511919884226-fd3cad34687c",
    "1541443131876-44b03de101c5", "1554670550-9a4f495574c8", "1506469717960-c33938eb8aeb",
    "1542362567-b05e50029644", "1517524008410-d00ade2538be", "1532581291347-9c39cc129550",
    "1536766768598-e0e00ec0ce59", "1553265027-697625c7ec11", "1562911791-c7a97b729ac5",
    "1563720223125-2418524016b3", "1494905997459-bb01cdd3df7a", "1490216124119-e9391d17f053",
    "1493238541226-4fa290338f97", "1503736362164-1595eb5a5235", "1511919484226-fd3cad34687c",
    "1520031447085-f12255e42214", "1542281177-3878b60a265b", "1550005810-18a033f81646"
]

SAVE_DIR = "/mnt/windows/songs/Smooth/images"
TOTAL_TO_DOWNLOAD = 120 # Aiming for 100+

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

print(f"Expanding asset library to {TOTAL_TO_DOWNLOAD} images...")

for i in range(TOTAL_TO_DOWNLOAD):
    filename = f"car_{i+1}.jpg"
    filepath = os.path.join(SAVE_DIR, filename)
    
    # Skip if already exists
    if os.path.exists(filepath):
        continue
        
    photo_id = PHOTO_IDS[i % len(PHOTO_IDS)]
    # Varying the width/height slightly to trigger different Unsplash cache/crops for variety
    url = f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&w={800 + (i%5)*100}&q=80"
    
    try:
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"Downloaded {filename}")
        else:
            # If 404, try a fallback safe ID
            fallback_url = f"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
            response = requests.get(fallback_url)
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"Fallback {filename}")
    except Exception as e:
        print(f"Failed {filename}: {e}")
    
    time.sleep(0.2)

print("Expansion complete.")
