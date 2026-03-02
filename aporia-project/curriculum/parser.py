import os
import json
import re

def parse_curriculum():
    directory = './curriculum'
    database = []
    
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            with open(os.path.join(directory, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                # Split the file by "DAY X" markers
                day_blocks = re.split(r'###\s*DAY\s+\d+', content)
                
                day_num = 1
                for block in day_blocks[1:]: # Skip the first empty split
                    entry = {
                        "day": day_num,
                        "title": "Untitled",
                        "thinker": "Unknown",
                        "seed": "",
                        "synthesis": "",
                        "application": "",
                        "tags": "",
                        "evidence": ""
                    }
                    
                    # Extract specific fields using Regex
                    title_match = re.search(r'\*\*Title:\*\*\s*(.*)', block)
                    thinker_match = re.search(r'\*\*Thinker:\*\*\s*(.*)', block)
                    
                    if title_match: entry["title"] = title_match.group(1).strip()
                    if thinker_match: entry["thinker"] = thinker_match.group(1).strip()

                    # Helper function to grab content between "---" markers
                    def get_section(marker):
                        pattern = f"--- {marker} ---(.*?)(?=---|$)"
                        match = re.search(pattern, block, re.DOTALL)
                        return match.group(1).strip() if match else ""

                    entry["seed"] = get_section("THE SEED")
                    entry["synthesis"] = get_section("THE SYNTHESIS")
                    entry["application"] = get_section("THE APPLICATION")
                    entry["tags"] = get_section("THE TAGS")
                    entry["evidence"] = get_section("THE EVIDENCE NOTE")

                    database.append(entry)
                    day_num += 1

    # THE CRITICAL FIX: json.dump handles all the escaping automatically
    output_path = './web-app/src/aporia_database.json'
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(database, out, indent=4, ensure_ascii=False)
    
    print(f"Successfully generated {len(database)} entries in {output_path}")

if __name__ == "__main__":
    parse_curriculum()