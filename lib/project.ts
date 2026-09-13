import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { Project } from "@/lib/rostr/types";

// Load a single project's definition from the projects/<id>/project.json file.
// Returns null when the file is missing or unreadable.
export async function loadProject(id: string): Promise<Project | null> {
  try {
    const raw = await readFile(join(process.cwd(), "projects", id, "project.json"), "utf8");
    return JSON.parse(raw) as Project;
  } catch {
    return null;
  }
}

// Scan the projects/ directory and return id + name for every folder that
// contains a project.json. Missing or unreadable folders are skipped.
export async function listProjects(): Promise<{ id: string; name: string }[]> {
  const dir = join(process.cwd(), "projects");
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  const out: { id: string; name: string }[] = [];
  for (const id of entries) {
    const project = await loadProject(id);
    if (project) {
      out.push({ id: project.id ?? id, name: project.name ?? id });
    }
  }
  return out;
}

// Load the raw text of a skill's SKILL.md from the skills bundle.
// Returns "" when the skill folder or file is missing, so routes can
// fall back to a skill-less run instead of crashing.
export async function loadSkillText(skillName: string): Promise<string> {
  try {
    return await readFile(join(process.cwd(), "skills", skillName, "SKILL.md"), "utf8");
  } catch {
    return "";
  }
}
