import { NextRequest, NextResponse } from "next/server";
import { ParseResult, Student } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

const MOCK_DATA = `
1. Бойко Іван - 150 балів - 5А клас
2. Шевченко Тарас - 145 балів - 3Б клас
3. Леся Українка - 140 балів - 4 клас
4. Франко Петро - 138 балів - 2Г клас
5. Сковорода Григорій - 130 балів - 6 клас
6. Костенко Ліна - 125 балів - 5В клас
7. Тичина Павло - 120 балів - 1А клас
8. Стус Василь - 110 балів - 3А клас
9. Симоненко Василь - 105 балів - 4Б клас
10. Підмогильний Валер'ян - 100 балів - 2В клас
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = body.text || body.rawText;

    if (!rawText || rawText.length < 5) {
      return NextResponse.json(
        { students: [], warnings: ["Text is too short"] },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // --- FALLBACK MOCK PARSER (Heuristic) ---
      console.warn("No OPENAI_API_KEY found, using crude regex parser.");
      const students: Student[] = [];

      // Split by newline OR by numbered list lookahead (e.g. " 2. ", " 10. ")
      // This helps if people paste a single paragraph of data.
      const rawBlocks = rawText.split(/(?=\s*\d+\.\s+)/);

      for (const block of rawBlocks) {
        const lines = block.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;

          // Split by hyphens but only those surrounded by spaces where possible
          // or just split and be smart about joining.
          // Format expected: "Name - Points - Class"
          const parts = line.split(/\s*[-–—]\s*/).map((s: string) => s.trim());

          if (parts.length >= 2) {
            let name = parts[0].replace(/^\d+\.\s*/, '').trim();
            let pointsStr = "";
            let classLabel = "N/A";

            // If we have 3 or more parts: [Name, Points, Class...]
            if (parts.length >= 3) {
              pointsStr = parts[1].replace(/[^0-9]/g, '');
              // Join the rest as the class label in case it contains hyphens
              classLabel = parts.slice(2).join('-');
            } else {
              // Only 2 parts: [Name, Points]
              pointsStr = parts[1].replace(/[^0-9]/g, '');
            }

            if (name && pointsStr) {
              const nameParts = name.split(/\s+/);
              students.push({
                id: uuidv4(),
                firstName: nameParts.slice(1).join(' ') || "",
                lastName: nameParts[0] || name,
                fullName: name,
                points: parseInt(pointsStr, 10),
                classLabel: classLabel,
                rank: 0
              });
            }
          }
        }
      }

      return NextResponse.json({
        students: students,
        warnings: ["Running in Offline Mode (No API Key). Parsing was done via simple regex. Format as 'Name - Points - Class'."]
      } as ParseResult);
    }

    // --- REAL AI PARSER ---
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `
    You are a data extraction assistant. 
    Extract student chess ranking data from the user's text.
    Return ONLY a JSON object with a key "students".
    Each student must have:
    - firstName (string)
    - lastName (string)
    - fullName (string)
    - points (integer)
    - classLabel (string, preserve full label like "3-C", "1-Г", "5 class")
    
    IMPORTANT: Do not strip letters or hyphens from classLabel.
    If data is missing/unclear, guess reasonably or skip.
    Output valid JSON only.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: rawText },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || "{}");

    // Add UUIDs and initial ranks
    const studentsWithIds = (parsed.students || []).map((s: any) => ({
      ...s,
      id: uuidv4(),
      rank: 0,
    }));

    return NextResponse.json({
      students: studentsWithIds,
      warnings: []
    } as ParseResult);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
