// File: src/lib/getAllProjects.ts

import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";
import { Project, ProjectWithToc } from "@/types/project";
import { extractMetadataFromMarkdown } from "../util/extractMetadataFromMarkdown";

const PROJECTS_DIR = path.join(process.cwd(), "src", "posts", "projects");
const USE_GIT_FALLBACK = process.env.USE_GIT_FALLBACK !== "false" && process.env.USE_GIT_FALLBACK !== "0";
const DEFAULT_IMAGE_PATH = "/images/placeholder.png";

function getGitLastCommitInfo(filePath: string, format: string): string | null {
  if (!USE_GIT_FALLBACK) return null;
  try {
    const formattedPath = path.normalize(filePath);
    const escapedPath = formattedPath.includes(" ")
      ? `"${formattedPath.replace(/(["$`\\])/g, "\\$1")}"`
      : formattedPath.replace(/(["$`\\])/g, "\\$1");
    const command = `git log -1 --follow --format=${format} -- ${escapedPath}`;
    return execSync(command, { timeout: 5000, stdio: "pipe", encoding: "utf8" }).toString().trim();
  } catch {
    return null;
  }
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const projects: Project[] = [];
  const categories = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;
    const categoryPath = path.join(PROJECTS_DIR, category.name);
    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

      const filePath = path.join(categoryPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "");

      const title = data.title || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      const description = data.description || content.slice(0, 150).replace(/\n/g, " ").trim() + "...";
      let date = data.date || getGitLastCommitInfo(filePath, "%as") || new Date().toISOString().split("T")[0];
      if (date instanceof Date) date = date.toISOString().split("T")[0];

      let image = data.image;
      const imgName = `/projects/${category.name}/${slug}`;
      const publicPath = path.join(process.cwd(), "public");
      if (!image) {
        if (fs.existsSync(path.join(publicPath, imgName + ".jpg"))) image = imgName + ".jpg";
        else if (fs.existsSync(path.join(publicPath, imgName + ".png"))) image = imgName + ".png";
        else if (fs.existsSync(path.join(publicPath, imgName + ".webp"))) image = imgName + ".webp";
        else image = DEFAULT_IMAGE_PATH;
      }

      projects.push({
        slug,
        title,
        description,
        longDescription: data.longDescription || "",
        date,
        modifiedDate: getGitLastCommitInfo(filePath, "%cI") || undefined,
        category: category.name,
        tags: data.tags || [],
        image,
        images: data.images || [],
        link: data.link || "",
        github: data.github || "",
        featured: data.featured || false,
        content,
        technologies: data.technologies || [],
        stats: data.stats || [],
        status: data.status || "completed",
        team: data.team || [],
        testimonials: data.testimonials || [],
        bgColor: data.bgColor || "",
        textColor: data.textColor || "",
        sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 99,
        draft: data.draft === true
      });
    }
  }

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.featured && b.featured) return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}


export function getProjectByCategoryAndSlug(category: string, slug: string): Project | null {
  return getAllProjects().find(p => p.category === category && p.slug === slug) || null;
}

export function getProjectBySlug(category: string, slug: string): ProjectWithToc | null {
  const md = path.join(PROJECTS_DIR, category, `${slug}.md`);
  const mdx = path.join(PROJECTS_DIR, category, `${slug}.mdx`);
  const filePath = fs.existsSync(md) ? md : fs.existsSync(mdx) ? mdx : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const { toc } = extractMetadataFromMarkdown(content);

  let image = data.image;
  const imgBase = `/projects/${category}/${slug}`;
  const publicDir = path.join(process.cwd(), "public");
  if (!image) {
    if (fs.existsSync(path.join(publicDir, imgBase + ".jpg"))) image = imgBase + ".jpg";
    else if (fs.existsSync(path.join(publicDir, imgBase + ".png"))) image = imgBase + ".png";
    else if (fs.existsSync(path.join(publicDir, imgBase + ".webp"))) image = imgBase + ".webp";
    else image = DEFAULT_IMAGE_PATH;
  }

  const title = data.title || slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const description = data.description || content.slice(0, 150).replace(/\n/g, " ").trim() + "...";
  let date = data.date || getGitLastCommitInfo(filePath, "%as") || new Date().toISOString().split("T")[0];
  if (date instanceof Date) date = date.toISOString().split("T")[0];

  return {
    slug,
    title,
    description,
    longDescription: data.longDescription || "",
    date,
    modifiedDate: getGitLastCommitInfo(filePath, "%cI") || undefined,
    category,
    tags: data.tags || [],
    image,
    images: data.images || [],
    link: data.link || "",
    github: data.github || "",
    featured: data.featured || false,
    content,
    technologies: data.technologies || [],
    stats: data.stats || [],
    status: data.status || "completed",
    team: data.team || [],
    testimonials: data.testimonials || [],
    bgColor: data.bgColor || "",
    textColor: data.textColor || "",
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 99,
    draft: data.draft === true,
    toc
  };
}

export function getAllProjectPaths() {
  return getAllProjects().map(p => ({ category: p.category, slug: p.slug }));
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects().filter(p => p.featured).slice(0, limit);
}

export function getProjectCategories(): string[] {
  return Array.from(new Set(getAllProjects().map(p => p.category))).sort();
}

export function getProjectsByCategory(category: string): Project[] {
  return getAllProjects().filter(p => p.category === category);
}

export function getRelatedProjects(current: Project, limit = 3): Project[] {
  const all = getAllProjects();
  const tags = new Set(current.tags);

  const related = all
    .filter(p => p.slug !== current.slug)
    .map(p => {
      let score = p.category === current.category ? 2 : 0;
      score += (p.tags || []).filter(t => tags.has(t)).length;
      return { ...p, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  if (related.length < limit) {
    const slugs = new Set(related.map(r => r.slug));
    slugs.add(current.slug);
    const fallback = all.filter(p => !slugs.has(p.slug)).slice(0, limit - related.length);
    related.push(...fallback.map(p => ({ ...p, score: 0 })));
  }

  return related;
}
