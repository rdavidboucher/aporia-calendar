import json
import re
import os

def parse_aporia_files(directory):
    database = []
    # Regex to capture the structured blocks
    entry_pattern = re.compile(r"DAY (\d+).*?Title: (.*?)\nThinker: (.*?)\n.*?--- THE SEED ---\n(.*?)\n--- THE SYNTHESIS ---\n(.*?)\n--- THE APPLICATION ---\n(.*?)\n--- THE TAGS ---\n(.*?)\n--- THE EVIDENCE NOTE ---\n(.*?)(?=\n==|---|$)", re.DOTALL)

    for filename in sorted(os.listdir(directory)):
        if filename.endswith(".txt"):
            with open(os.path.join(directory, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                matches = entry_pattern.findall(content)
                for m in matches:
                    database.append({
                        "day": int(m[0]),
                        "title": m[1].strip(),
                        "thinker": m[2].strip(),
                        "seed": m[3].strip(),
                        "synthesis": m[4].strip(),
                        "application": m[5].strip(),
                        "tags": [t.strip() for t in m[6].replace('[','').replace(']','').split()],
                        "evidence": m[7].strip(),
                        "srs": {"ease": 2.5, "interval": 0, "next_review": 0}
                    })
    
    with open('aporia_database.json', 'w') as out:
        json.dump(database, out, indent=2)

parse_aporia_files('./')