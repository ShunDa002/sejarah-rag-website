/**
 * Fake AI responses for simulating RAG chat.
 * Each response demonstrates various markdown features.
 */
export const FAKE_RESPONSES: string[] = [
  `## The Malacca Sultanate (1400–1511)

The **Malacca Sultanate** was a powerful maritime empire centered in modern-day **Melaka, Malaysia**. Founded by **Parameswara** (later known as Iskandar Shah), it became one of the most significant trading hubs in Southeast Asia.

### Key Facts

| Aspect | Details |
|--------|---------|
| Founded | c. 1400 CE |
| Founder | Parameswara |
| Capital | Malacca |
| Religion | Islam (from early 15th century) |
| Fall | 1511 (Portuguese conquest) |

### Rise to Power

1. **Strategic Location** — Situated on the narrow Strait of Malacca, controlling trade between the Indian Ocean and the South China Sea.
2. **Chinese Patronage** — Admiral Zheng He's treasure fleet visited multiple times, offering protection.
3. **Islamization** — The conversion to Islam opened trade networks with the Muslim world.

> "Malacca was the richest seaport with the greatest number of wholesale merchants and abundance of shipping that can be found in the whole world."
> — Tomé Pires, *Suma Oriental* (1515)

### Code Example: Malacca Timeline

\`\`\`python
timeline = {
    1400: "Parameswara founds Malacca",
    1405: "First visit of Zheng He",
    1414: "Conversion to Islam",
    1446: "Tun Perak becomes Bendahara",
    1511: "Portuguese conquest under Afonso de Albuquerque"
}

for year, event in timeline.items():
    print(f"{year}: {event}")
\`\`\`

The fall of Malacca in **1511** marked the beginning of European colonial influence in Southeast Asia.`,

  `## The Japanese Occupation of Malaya (1941–1945)

The Japanese military occupied **British Malaya** from December 1941 until Japan's surrender in August 1945. This period had a profound impact on Malaysian society.

### Timeline of Events

- **8 December 1941** — Japanese forces land in Kota Bharu, Kelantan
- **15 February 1942** — Fall of Singapore
- **1943–1944** — Height of the occupation
- **15 August 1945** — Japan surrenders

### Impact on Different Communities

| Community | Experience |
|-----------|------------|
| Malay | Some co-opted into administration, others suffered |
| Chinese | Faced severe persecution (*Sook Ching* massacres) |
| Indian | Some joined the Indian National Army (INA) |
| Orang Asli | Forced labour in the jungles |

### The Resistance

\`\`\`javascript
const resistanceGroups = [
  { name: "MPAJA", fullName: "Malayan People's Anti-Japanese Army", affiliation: "Communist" },
  { name: "Force 136", fullName: "SOE Force 136", affiliation: "British" },
  { name: "KMM", fullName: "Kesatuan Melayu Muda", affiliation: "Malay nationalist" }
];

resistanceGroups.forEach(group => {
  console.log(\`\${group.name}: \${group.fullName} (\${group.affiliation})\`);
});
\`\`\`

> The Japanese occupation awakened a sense of **nationalism** among all communities, laying the groundwork for the independence movement.`,

  `## The Road to Independence (Merdeka)

Malaysia's path to independence was shaped by several key movements and negotiations.

### Key Milestones

1. **1946** — Formation of the Malayan Union (opposed by Malays)
2. **1946** — UMNO founded to resist the Malayan Union
3. **1948** — Federation of Malaya established
4. **1948–1960** — Malayan Emergency
5. **1955** — First federal elections; Alliance Party wins
6. **31 August 1957** — **Merdeka!** Independence declared

### The Social Contract

The concept of the "social contract" refers to the agreement between the major communities:

- **Malays** — Special position (Article 153)
- **Non-Malays** — Citizenship rights (*jus soli*)
- **All communities** — Malay as national language, Islam as official religion

\`\`\`typescript
interface SocialContract {
  malaySpecialPosition: boolean;
  citizenshipForAll: boolean;
  nationalLanguage: "Malay";
  officialReligion: "Islam";
  rulerSystem: "Constitutional Monarchy";
}

const merdeka: SocialContract = {
  malaySpecialPosition: true,
  citizenshipForAll: true,
  nationalLanguage: "Malay",
  officialReligion: "Islam",
  rulerSystem: "Constitutional Monarchy"
};
\`\`\`

> **Tunku Abdul Rahman:** *"Merdeka! Merdeka! Merdeka!"*
> — Stadium Merdeka, 31 August 1957

### The Architects of Independence

- **Tunku Abdul Rahman** — Chief Minister, Father of Independence
- **Tun Tan Cheng Lock** — MCA President
- **Tun V.T. Sambanthan** — MIC President

Together, they demonstrated that **unity among diverse communities** was the foundation of an independent Malaya.`,

  `## The Formation of Malaysia (1963)

On **16 September 1963**, the Federation of Malaysia was formed, uniting:

- **Malaya** (the 11 states of Peninsular Malaysia)
- **Singapore** (separated in 1965)
- **North Borneo** (now Sabah)
- **Sarawak**

### Why Merge?

Several factors drove the formation:

1. **Security concerns** — Communist threat in the region
2. **Economic benefits** — Larger market and resource pool
3. **Balance** — Singapore's Chinese majority balanced by Borneo's indigenous populations

### Opposition: Konfrontasi

Indonesia's President Sukarno opposed the formation, leading to **Konfrontasi** (1963–1966):

\`\`\`bash
# Timeline of Konfrontasi
echo "1963 - Indonesia announces 'Ganyang Malaysia' (Crush Malaysia)"
echo "1964 - Indonesian soldiers infiltrate Peninsular Malaysia"
echo "1965 - Suharto rises to power in Indonesia"
echo "1966 - Peace treaty signed; Konfrontasi ends"
\`\`\`

### Singapore's Departure

> On **9 August 1965**, Singapore separated from Malaysia due to political disagreements, particularly regarding Malaysian Malaysia vs. special rights.

| Date | Event |
|------|-------|
| 16 Sep 1963 | Malaysia formed |
| 9 Aug 1965 | Singapore separates |
| 11 Aug 1966 | Konfrontasi ends |

Despite these challenges, Malaysia emerged as a **stable, multi-ethnic nation** in Southeast Asia.`,

  `I appreciate your question! However, I don't have specific information about that topic in my current knowledge base. 

Here are some suggestions:

- Try asking about **major historical events** in Malaysian history
- Ask about specific periods like the **Malacca Sultanate**, **colonial era**, or **independence movement**
- I can also help with **general Southeast Asian history** topics

Would you like to explore any of these topics instead?`,
];

/**
 * Select a response based on simple keyword matching.
 * Falls back to a random historical response.
 */
export function getResponseForMessage(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("malacca") ||
    lower.includes("melaka") ||
    lower.includes("sultanate") ||
    lower.includes("parameswara")
  ) {
    return FAKE_RESPONSES[0];
  }
  if (
    lower.includes("japan") ||
    lower.includes("occupation") ||
    lower.includes("ww2") ||
    lower.includes("world war")
  ) {
    return FAKE_RESPONSES[1];
  }
  if (
    lower.includes("merdeka") ||
    lower.includes("independence") ||
    lower.includes("tunku")
  ) {
    return FAKE_RESPONSES[2];
  }
  if (
    lower.includes("malaysia") ||
    lower.includes("formation") ||
    lower.includes("singapore") ||
    lower.includes("borneo") ||
    lower.includes("sarawak") ||
    lower.includes("sabah")
  ) {
    return FAKE_RESPONSES[3];
  }

  // Random historical response for unmatched queries
  const historicalResponses = FAKE_RESPONSES.slice(0, 4);
  return historicalResponses[
    Math.floor(Math.random() * historicalResponses.length)
  ];
}
