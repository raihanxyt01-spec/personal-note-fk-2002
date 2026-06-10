import { Note } from "../types";

const FIREBASE_DB_URL = "https://add-notes-a839d-default-rtdb.asia-southeast1.firebasedatabase.app";

export async function fetchNotes(): Promise<Note[]> {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/notes.json`);
    const data = await response.json();
    
    if (!data) return [];

    // Firebase stores objects as { pushId1: {..}, pushId2: {..} }
    const notesArray: Note[] = Object.keys(data).map((key) => ({
      ...data[key],
      id: key,
      vocabularies: data[key].vocabularies || [],
      questions: data[key].questions || [],
      image: data[key].image || null,
    }));

    // Sort by newest first
    return notesArray.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function saveNote(note: Omit<Note, "id">): Promise<boolean> {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/notes.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error saving note:", error);
    return false;
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/notes/${id}.json`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}
