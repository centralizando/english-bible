
import { BibleChapter, ReadingPlanDay } from './types';

const BASE_URL = 'https://bible-api.com/';

export const BIBLE_METADATA = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
];

export const BOOKS = BIBLE_METADATA.map(b => b.name);

export async function fetchChapter(book: string, chapter: number): Promise<BibleChapter> {
  const response = await fetch(`${BASE_URL}${encodeURIComponent(book)}+${chapter}`);
  if (!response.ok) throw new Error("Failed to fetch chapter from Bible API");
  const data = await response.json();
  
  return {
    book: book,
    chapter: chapter,
    verses: data.verses.map((v: any) => ({
      chapter: v.chapter,
      verse: v.verse,
      text: v.text.replace(/\s+/g, ' ').trim()
    }))
  };
}

export function generateReadingPlan(startDateStr?: string): ReadingPlanDay[] {
  const plan: ReadingPlanDay[] = [];
  let currentBookIndex = 0;
  let currentChapter = 1;

  // Use provided start date or default to Jan 1st of current year
  const baseDate = startDateStr ? new Date(startDateStr) : new Date(new Date().getFullYear(), 0, 1);

  for (let day = 1; day <= 365; day++) {
    const chaptersToday: string[] = [];
    const numChapters = (day % 4 === 0) ? 4 : 3;

    for (let i = 0; i < numChapters; i++) {
      if (currentBookIndex >= BIBLE_METADATA.length) break;
      const book = BIBLE_METADATA[currentBookIndex];
      chaptersToday.push(`${book.name} ${currentChapter}`);
      currentChapter++;
      if (currentChapter > book.chapters) {
        currentBookIndex++;
        currentChapter = 1;
      }
    }

    let label = "";
    if (chaptersToday.length > 0) {
      const first = chaptersToday[0];
      const last = chaptersToday[chaptersToday.length - 1];
      const firstBook = first.substring(0, first.lastIndexOf(' '));
      const lastBook = last.substring(0, last.lastIndexOf(' '));
      if (firstBook === lastBook) {
        const startChap = first.split(' ').pop();
        const endChap = last.split(' ').pop();
        label = startChap === endChap ? first : `${firstBook} ${startChap}-${endChap}`;
      } else {
        label = `${first} - ${last}`;
      }
    }

    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + (day - 1));
    const dateString = currentDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    plan.push({
      day,
      label: label || "Rest & Reflection",
      passages: chaptersToday,
      completed: false,
      date: dateString
    });
  }

  return plan;
}
