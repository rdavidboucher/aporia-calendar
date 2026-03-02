import json
import re

def generate_thinkers_index():
    # Ensure this points to where your database lives
    with open('./web-app/src/aporia_database.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    thinkers_set = set()
    
    for entry in data:
        thinker_field = entry.get("thinker", "")
        
        # Skip empty fields or "The Reader"
        if not thinker_field or thinker_field == "The Reader" or thinker_field == "Unknown":
            continue
            
        # Splits fields like "Cal Newport + Richard Hamming" into individual names
        split_thinkers = re.split(r'\s*\+\s*|\s+and\s+|\s*&\s*', thinker_field)
        
        for t in split_thinkers:
            t = t.strip()
            # Clean up notes in parentheses like "(via Plato)" if you want pure names
            t = re.sub(r'\s*\(.*?\)\s*', '', t)
            if t:
                thinkers_set.add(t)
                
    sorted_thinkers = sorted(list(thinkers_set))
    
    # Write to a Markdown file
    with open('Thinkers_Index.md', 'w', encoding='utf-8') as out:
        out.write("# 🏛️ APORIA: Master Index of Thinkers\n\n")
        for thinker in sorted_thinkers:
            out.write(f"- **{thinker}**\n")
            
    print(f"✅ Successfully generated index with {len(sorted_thinkers)} unique thinkers!")

if __name__ == "__main__":
    generate_thinkers_index()