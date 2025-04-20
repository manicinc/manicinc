// src/components/Project/ProjectDetailClient.tsx
// V7 - CORRECTED: Handles data from Server Component, Renders all elements

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Github, ExternalLink, Clock, ArrowLeft, Star, GitFork, AlertTriangle, Users, FileCode,
    Activity, Info, ChevronDown, ChevronUp, Layers, CalendarDays, Eye, ShieldCheck, MessageSquare, Tag, Image as ImageIcon
} from 'lucide-react';
import { Project, TableOfContentsItem } from '@/types/project'; // Use updated type
import ProjectCard from './ProjectCard';
import { CustomMarkdownRenderer } from '@/components/MarkdownRenderer';
import { parseGitHubUrl, fetchRepoMetadata, fetchRepoLanguages, fetchRepoContributors } from '@/lib/github';
import TableOfContents from './TableOfContents';
import MinimapNav from './MinimapNav';
import AsciiArtPlaceholder from '@/lib/asciiPlaceholders';

// GitHub Types with null allowances
interface GitHubRepoOwner { login?: string; avatar_url?: string; html_url?: string; }
interface GitHubRepoLicense { name?: string | null; spdx_id?: string | null; url?: string | null; }
interface GitHubRepoMetadata { name?: string; description?: string | null; html_url?: string; owner?: GitHubRepoOwner; stargazers_count?: number; forks_count?: number; subscribers_count?: number; open_issues_count?: number; size?: number; language?: string | null; license?: GitHubRepoLicense | null; created_at?: string; updated_at?: string; pushed_at?: string; homepage?: string | null; topics?: string[]; }
interface GitHubContributor { id?: number; login?: string; avatar_url?: string; html_url?: string; contributions?: number; }

interface ProjectDetailClientProps {
  // Expects Project type which now has optional 'toc' from types/project.ts
  project: Project;
  relatedProjects: Project[];
  // toc prop is optional fallback, main source is project.toc
  toc?: TableOfContentsItem[];
}

// --- Helper Functions ---
const parseNumericStat = (value: string | number | undefined): number => { if (typeof value === 'number') return value; if (typeof value !== 'string' || !value) return 0; const c = value.toLowerCase().trim().replace(/,/g, ''); let n = parseFloat(c); if (isNaN(n)) return 0; if (c.endsWith('k')) n *= 1000; else if (c.endsWith('m')) n *= 1000000; return Math.round(n); };
const getStatValue = (project: Project | null | undefined, statName: 'Stars' | 'Forks' | string): number => { if (!project) return 0; const pl = [statName.toLowerCase(), `github ${statName}`.toLowerCase()]; if (project.stats && Array.isArray(project.stats)) { for (const l of pl) { const s = project.stats.find(st => st?.label?.trim().toLowerCase() === l); if (s && typeof s.value !== 'undefined') { return parseNumericStat(s.value); } } } const dpn = statName.toLowerCase(); if (project.hasOwnProperty(dpn) && typeof (project as any)[dpn] !== 'undefined') { return parseNumericStat((project as any)[dpn]); } if (project.hasOwnProperty(`github${statName}`) && typeof (project as any)[`github${statName}`] !== 'undefined') { return parseNumericStat((project as any)[`github${statName}`]); } return 0; };
const formatBytes = (bytes: number, decimals = 1): string => { if (!bytes || bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); const sizeIndex = i < sizes.length ? i : sizes.length - 1; const calculatedValue = parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm)); return calculatedValue + ' ' + sizes[sizeIndex]; };
const timeAgo = (date: string | number | Date | undefined): string => { if (!date) return 'N/A'; const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000); if (seconds < 60) return `${seconds} sec ago`; let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " yr ago" : " yrs ago"); interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " mo ago" : " mos ago"); interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago"); interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hr ago" : " hrs ago"); interval = seconds / 60; if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " min ago" : " mins ago"); return Math.floor(seconds) + " sec ago"; };
// --- End Helpers ---

export default function ProjectDetailClient({ project, relatedProjects = [], toc: tocProp = [] }: ProjectDetailClientProps) {
  const [githubMeta, setGithubMeta] = useState<GitHubRepoMetadata | null>(null);
  const [languages, setLanguages] = useState<Record<string, number> | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);
  const [isGithubInsightsOpen, setIsGithubInsightsOpen] = useState<boolean>(true);

  // Use TOC from project prop first
  const currentToc = project?.toc && project.toc.length > 0 ? project.toc : tocProp;

  // Fetch GitHub Data Effect
  useEffect(() => {
    let isMounted = true;
    const fetchGithubData = async () => {
      if (!project?.github) return;
      const repoInfo = parseGitHubUrl(project.github);
      if (!repoInfo) { if (isMounted) setGithubError("Invalid GitHub URL format."); return; }
      if (isMounted) { setIsLoadingGithub(true); setGithubError(null); setGithubMeta(null); setLanguages(null); setContributors([]); }
      try {
        const [meta, langs, contribs] = await Promise.allSettled([
          fetchRepoMetadata(repoInfo.user, repoInfo.repo),
          fetchRepoLanguages(repoInfo.user, repoInfo.repo),
          fetchRepoContributors(repoInfo.user, repoInfo.repo)
        ]);
        if (!isMounted) return;
        if (meta.status === 'fulfilled' && meta.value) { setGithubMeta(meta.value as GitHubRepoMetadata); }
        else if (meta.status === 'rejected') { console.error("GH Meta Error:", meta.reason); throw new Error("Failed to fetch repository metadata."); }
        if (langs.status === 'fulfilled') { setLanguages(langs.value); }
        else { console.error("GH Lang Error:", langs.reason); }
        if (contribs.status === 'fulfilled' && Array.isArray(contribs.value)) { setContributors(contribs.value as GitHubContributor[]); }
        else if (contribs.status === 'rejected') { console.error("GH Contrib Error:", contribs.reason); }
      } catch (error: any) { if (isMounted) setGithubError(error.message || "Error fetching GitHub data."); console.error(error); }
      finally { if (isMounted) setIsLoadingGithub(false); }
    };
    fetchGithubData();
    return () => { isMounted = false; };
  }, [project?.github]);

  // Check project existence (should be guaranteed by Server Component, but good practice)
  if (!project) { return ( <div className="project-load-error container mx-auto p-8 text-center text-text-muted">Error: Project data not available.</div> ); }

  // Destructure project properties with defaults
  const { title = 'Untitled Project', category = 'Uncategorized', description = '', longDescription, content, date, image, images, tags = [], github, link, team = [], status, testimonials = [] } = project;
  const displayStatus = status === 'ongoing' || status === 'concept' ? status : null;
  const projectYear = date ? new Date(date).getFullYear() : null;
  const displayDescription = longDescription || description || "No detailed description available.";
  const primaryImageUrl = (images && images.length > 0) ? images[0] : image;
  const galleryImages = images && images.length > 1 ? images.slice(1) : (image && images?.[0] !== image ? [image] : []);
  const hasVisuals = !!primaryImageUrl || (galleryImages && galleryImages.length > 0); // Corrected check

  // GitHub Stats calculation
  const stars = githubMeta?.stargazers_count ?? getStatValue(project, 'Stars');
  const forks = githubMeta?.forks_count ?? getStatValue(project, 'Forks');
  const watchers = githubMeta?.subscribers_count ?? 0;
  const license = githubMeta?.license?.name ?? project.license ?? 'N/A';
  const openIssues = githubMeta?.open_issues_count ?? 0;
  const repoSize = githubMeta?.size ?? 0;
  const createdAt = githubMeta?.created_at ?? null;
  const pushedAt = githubMeta?.pushed_at ?? project.modifiedDate ?? date ?? null;
  const sortedLanguages = languages ? Object.entries(languages).sort(([, a], [, b]) => b - a) : [];
  const topLanguages = sortedLanguages.slice(0, 6);
  const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);
  const liveUrl = link || githubMeta?.homepage || undefined; // Use project.link first

  const layoutClass = currentToc && currentToc.length > 0 ? 'layout-grid-with-toc' : 'layout-grid-no-toc';

  return (
    <main className="project-detail-page bg-bg-primary text-text-primary pt-8 pb-24 font-body">
        {currentToc && currentToc.length > 0 && <MinimapNav toc={currentToc} />}

        <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ${layoutClass}`}>

           {currentToc && currentToc.length > 0 && (
                <aside className="toc-sidebar sticky top-20 self-start">
                    <TableOfContents toc={currentToc} />
                </aside>
           )}

            {/* Main Content Area */}
            <div className="main-content-area">
                {/* --- Header --- */}
                <header className="project-header mb-10 md:mb-12">
                    <Link href="/projects" className="back-link group mb-5"> <ArrowLeft size={15} className="icon"/> <span>Return to Matrix</span> </Link>
                    <div className="header-main">
                         <div className="header-content">
                             <div className="meta-info mb-3">
                                 {category && <span className="category-badge">{category}</span>}
                                 {projectYear && <span className="year-badge"><Clock size={11} className="icon"/>{projectYear}</span>}
                                 {displayStatus && <span className={`status-badge status-${displayStatus}`}>{displayStatus}</span>}
                                 {github && stars > 0 && <span className="meta-chip github-stat" title={`${stars.toLocaleString()} Stars`}> <Star size={12} className="icon"/> {stars.toLocaleString()} </span> }
                                 {github && forks > 0 && <span className="meta-chip github-stat" title={`${forks.toLocaleString()} Forks`}> <GitFork size={12} className="icon"/> {forks.toLocaleString()} </span> }
                             </div>
                             <h1 className="project-title project-title-popout" data-text={title}>{title}</h1>
                             <p className="project-description">{displayDescription}</p>
                         </div>
                         <div className="action-buttons mt-5 flex flex-wrap items-start gap-3">
                             {liveUrl && ( <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn-glow"> <ExternalLink size={14} className="mr-1.5" /> View Live </Link> )}
                             {github && ( <Link href={github} target="_blank" rel="noopener noreferrer" className="btn-outline"> <Github size={14} className="mr-1.5" /> View Code </Link> )}
                         </div>
                      </div>
                </header>

                {/* --- VISUALS --- */}
                {hasVisuals ? (
                    <section className="project-visuals mb-10 md:mb-12 themed-box !p-0 bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary">
                         {primaryImageUrl && (
                             <div className="main-image-wrapper">
                                <Image src={primaryImageUrl} alt={`${title} primary visual`} width={1280} height={720} className="visual-image" priority />
                             </div>
                         )}
                         {galleryImages && galleryImages.length > 0 && (
                             <div className="sub-gallery">
                                 {galleryImages.map((imgSrc, idx) => (
                                     <div key={idx} className="sub-gallery-item">
                                          <Image src={imgSrc} alt={`${title} visual ${idx + 2}`} width={400} height={250} className="sub-gallery-image" loading="lazy"/>
                                     </div>
                                 ))}
                             </div>
                         )}
                    </section>
                 ) : (
                     <section className="project-visuals placeholder-visuals mb-10 md:mb-12">
                         <div className="placeholder-icon"><ImageIcon size={48} strokeWidth={1}/></div>
                         <AsciiArtPlaceholder width="125px" height="250px" animate={true} className="ascii-placeholder-detail"/>
                     </section>
                 )}

                {/* --- MARKDOWN CONTENT --- */}
                {content ? (
                    <section id="project-content-start" className="prose prose-custom max-w-none mb-10 md:mb-12" aria-label="Project Details">
                        <CustomMarkdownRenderer>{content}</CustomMarkdownRenderer>
                    </section>
                 ) : (
                    <section className="prose prose-custom max-w-none mb-10 md:mb-12">
                        <p className="italic text-text-muted font-mono">// Detailed documentation stream offline or redacted. //</p>
                    </section>
                )}

                 {/* --- TAGS --- */}
                 {tags && tags.length > 0 && (
                    <section className="tags-section themed-box mb-8 md:mb-12">
                         <div className="box-header simple">
                            <Tag size={16} className="header-icon text-purple-400"/>
                            <h3 className="box-title !text-base">Keywords & Concepts</h3>
                         </div>
                         <div className="box-content"> <div className="tags-list"> {tags.map(tag => ( <span key={tag} className="tag-chip">{tag}</span> ))} </div> </div>
                    </section>
                 )}

                {/* --- GITHUB INSIGHTS --- */}
                 {github && (isLoadingGithub || githubMeta || githubError) && (
                    <section className="github-insights themed-box mb-8 md:mb-12">
                        <button className="box-header collapsible-header" onClick={() => setIsGithubInsightsOpen(!isGithubInsightsOpen)} aria-expanded={isGithubInsightsOpen} aria-controls="github-insights-content">
                             <div className="header-left"> <Github size={18} className="header-icon text-cyan-400"/> <h2 className="box-title">GitHub Repository Insights</h2> </div>
                             <div className="header-right"> {isLoadingGithub && <span className="loading-indicator">Syncing...</span>} {githubError && <span title={githubError}><AlertTriangle size={16} className="error-icon"/></span>} <span className={`chevron-icon ${isGithubInsightsOpen ? 'open' : ''}`}> <ChevronDown size={20}/> </span> </div>
                        </button>
                         {isGithubInsightsOpen && (
                             <div id="github-insights-content" className="box-content">
                                 {githubError && !isLoadingGithub && (<div className="error-message">{githubError}</div>)}
                                 {!githubError && isLoadingGithub && (<div className="loading-placeholder">// Establishing uplink to GitHub... //</div>)}
                                 {!githubError && !isLoadingGithub && !githubMeta && (<div className="error-message">No GitHub metadata available.</div>)}
                                 {!githubError && githubMeta && (
                                     <div className="grid gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                                         {/* Stats Grid */}
                                         <div className="stat-item"><Star size={15} className="icon text-yellow-400"/><span>Stars:</span> <strong>{stars > 0 ? stars.toLocaleString() : '0'}</strong></div>
                                         <div className="stat-item"><GitFork size={15} className="icon text-blue-400"/><span>Forks:</span> <strong>{forks > 0 ? forks.toLocaleString() : '0'}</strong></div>
                                         <div className="stat-item"><Eye size={15} className="icon text-green-400"/><span>Watchers:</span> <strong>{watchers > 0 ? watchers.toLocaleString() : '0'}</strong></div>
                                         <div className="stat-item"><AlertTriangle size={15} className="icon text-orange-400"/><span>Open Issues:</span> <strong>{openIssues > 0 ? openIssues.toLocaleString() : '0'}</strong></div>
                                         <div className="stat-item"><ShieldCheck size={15} className="icon text-teal-400"/><span>License:</span> <strong>{license || 'N/A'}</strong></div>
                                         <div className="stat-item"><Layers size={15} className="icon text-indigo-400"/><span>Repo Size:</span> <strong>{repoSize > 0 ? formatBytes(repoSize * 1024) : '-'}</strong></div>
                                         {createdAt && <div className="stat-item"><CalendarDays size={15} className="icon text-gray-400"/><span>Created:</span> <strong title={new Date(createdAt).toLocaleString()}>{timeAgo(createdAt)}</strong></div>}
                                         {pushedAt && <div className="stat-item"><Activity size={15} className="icon text-gray-400"/><span>Last Push:</span> <strong title={new Date(pushedAt).toLocaleString()}>{timeAgo(pushedAt)}</strong></div>}
                                         {githubMeta.homepage && <div className="stat-item sm:col-span-2 lg:col-span-1"><ExternalLink size={15} className="icon text-cyan-400"/><span>Homepage:</span> <strong><a href={githubMeta.homepage} target="_blank" rel="noopener noreferrer" className="link-hover">{githubMeta.homepage}</a></strong></div>}
                                         {/* Languages Section */}
                                         {languages && totalBytes > 0 && ( <div className="language-section sm:col-span-2 lg:col-span-3"> <h4 className="sub-heading">// Language Distribution</h4> <div className="language-bars"> {sortedLanguages.map(([lang, bytes]) => { const percentage = totalBytes > 0 ? Math.max(0.5, parseFloat(((bytes / totalBytes) * 100).toFixed(1))) : 0; return ( <div key={lang} className="language-bar-item" title={`${lang}: ${formatBytes(bytes)} (${percentage}%)`}> <div className="lang-label">{lang} <span className="lang-percent">({percentage}%)</span></div> <div className="lang-bar-bg"><div className="lang-bar-fg" style={{ width: `${percentage}%`, background: `var(--lang-${lang.toLowerCase().replace(/[^a-z0-9]/g, '')}, var(--accent-primary))` }}></div></div> </div> ); })} </div> </div> )}
                                         {/* Contributors Section */}
                                         {contributors && contributors.length > 0 && ( <div className="contributors-section sm:col-span-full"> <h4 className="sub-heading">// Top Contributors</h4> <div className="contributor-list"> {contributors.slice(0, 18).map(c => ( <Link key={c.id} href={c.html_url || '#'} target="_blank" rel="noopener noreferrer" className="contributor-item group" title={`${c.login} (${c.contributions} contributions)`}> <Image src={c.avatar_url || '/default-avatar.png'} alt={`${c.login} avatar`} width={36} height={36} className="contributor-avatar"/> <span className="contributor-login">{c.login}</span> </Link> ))} {contributors.length > 18 && <span className="contributor-more">...</span>} </div> </div> )}
                                     </div>
                                 )}
                             </div>
                         )}
                    </section>
                 )}

                {/* --- TEAM / AUTHOR SECTION --- */}
                 {(team && team.length > 0) || githubMeta?.owner ? (
                     <section className="team-section themed-box mb-8 md:mb-12">
                          <div className="box-header simple">
                              <Users size={18} className="header-icon text-green-400"/>
                              <h2 className="box-title !text-lg">{team && team.length > 0 ? 'Core Team' : 'Repository Owner'}</h2>
                          </div>
                         <div className="box-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {team && team.length > 0 ? ( team.map((member, index) => ( <div key={index} className="team-member group"> {member.photo ? <Image src={member.photo} alt={member.name || 'Team member'} width={40} height={40} className="team-photo" /> : <div className="team-photo-placeholder"><Users size={18}/></div> } <div className="member-info"> <span className="member-name">{member.name || 'Contributor'}</span> {member.role && <span className="member-role">{member.role}</span>} </div> {member.link && <Link href={member.link} target="_blank" rel="noopener noreferrer" className="member-link" title={`Visit ${member.name}'s profile`}><ExternalLink size={15}/></Link>} </div> )) )
                              : githubMeta?.owner ? ( <div className="team-member group"> {githubMeta.owner.avatar_url && <Image src={githubMeta.owner.avatar_url} alt={githubMeta.owner.login || 'Owner'} width={40} height={40} className="team-photo" />} <div className="member-info"> <span className="member-name">{githubMeta.owner.login || 'Owner'}</span> <span className="member-role">Repository Maintainer</span> </div> {githubMeta.owner.html_url && <Link href={githubMeta.owner.html_url} target="_blank" rel="noopener noreferrer" className="member-link" title={`Visit ${githubMeta.owner.login}'s GitHub`}><Github size={15}/></Link>} </div> )
                              : null}
                          </div>
                     </section>
                 ) : null}

                {/* --- TESTIMONIALS --- */}
                {testimonials && testimonials.length > 0 && (
                     <section className="testimonials-section mb-8 md:mb-12">
                         <h2 className="section-heading mb-6"><MessageSquare size={18} className="icon"/> Feedback Stream</h2>
                         <div className="testimonial-grid"> {testimonials.map((t, i) => ( <blockquote key={i} className="testimonial-item"> <p className="testimonial-quote">"{t.quote}"</p> <footer className="testimonial-author"> – {t.author}{t.role && <span className="testimonial-role">, {t.role}</span>} </footer> </blockquote> ))} </div>
                     </section>
                )}

                {/* --- RELATED PROJECTS --- */}
                {relatedProjects.length > 0 && (
                    <section className="related-projects mt-12 md:mt-16">
                        <h2 className="related-heading">// Related Signals //</h2>
                        <div className="related-grid"> {relatedProjects.map(p => p ? <ProjectCard key={p.slug} project={p} /> : null)} </div>
                    </section>
                )}

            </div> {/* End Main Content Area */}
        </div> {/* End Container / Layout Grid */}

        {/* --- Styles --- */}
        <style jsx>{`
            /* --- Base & Layout --- */
             .project-detail-page { background: var(--bg-gradient-darker); padding-bottom: 6rem; }
             .layout-grid-with-toc { display: grid; grid-template-columns: 220px 1fr; gap: 2.5rem; align-items: start; }
             .layout-grid-no-toc { display: block; max-width: 900px; margin-left: auto; margin-right: auto; } /* Center content if no TOC */
             .toc-sidebar { width: 220px; max-height: calc(100vh - 7rem); position: sticky; top: calc(var(--header-height, 65px) + 1.5rem); }
             .main-content-area { min-width: 0; }
             @media (max-width: 1100px) { .layout-grid-with-toc { grid-template-columns: 180px 1fr; gap: 1.5rem; } .toc-sidebar { width: 180px; } }
             @media (max-width: 800px) { .layout-grid-with-toc { display: block; } .toc-sidebar { position: relative; top: 0; width: 100%; margin-bottom: 2rem; max-height: 40vh; border-right: none; border-bottom: 1px solid var(--bg-tertiary); padding-right: 0; padding-bottom: 1rem; } }
             .project-load-error { padding: 4rem 1rem; text-align: center; }

             /* --- Header Elements --- */
             .project-header { border-bottom: 1px solid var(--bg-tertiary); padding-bottom: 2rem; margin-bottom: 2.5rem; }
             .back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1.2rem; transition: color var(--transition-fast), transform var(--transition-fast); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; }
             .back-link:hover { color: var(--accent-highlight); } .back-link .icon { transition: transform 0.2s ease-out; } .back-link:hover .icon { transform: translateX(-4px); }
             .header-main { /* Optional wrapper */ }
             .meta-info { display: flex; flex-wrap: wrap; gap: 0.7rem; align-items: center; margin-bottom: 1rem; }
             .category-badge { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; background-color: var(--accent-secondary); color: var(--bg-primary); padding: 5px 10px; border-radius: 4px; box-shadow: 1px 1px 2px rgba(0,0,0,0.3); white-space: nowrap; border: 1px solid rgba(var(--bg-primary-rgb), 0.3); }
             .year-badge, .status-badge, .meta-chip { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); background: rgba(var(--bg-secondary-rgb), 0.85); padding: 5px 10px; border-radius: 4px; border: 1px solid var(--bg-tertiary); white-space: nowrap; box-shadow: inset 0 1px 1px rgba(0,0,0,0.1); backdrop-filter: blur(2px); }
             .meta-chip .icon { opacity: 0.7; font-size: 0.9em; margin-right: 0.1em; }
             .status-badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 3px 7px; border-radius: 3px; letter-spacing: 0.06em; }
             .status-badge.status-ongoing { background-color: var(--accent-alert); color: var(--bg-primary); border-color: transparent; }
             .status-badge.status-concept { background-color: var(--accent-muted1); color: var(--bg-primary); border-color: transparent; }
             .meta-chip.github-stat { background-color: rgba(var(--bg-tertiary-rgb), 0.8); color: var(--text-secondary); border-color: rgba(var(--accent-secondary-rgb), 0.3); }
             .meta-chip.github-stat .icon { color: var(--accent-secondary); }
             .project-title { font-size: clamp(2.2rem, 6vw, 4rem); margin-bottom: 0.6rem; color: var(--text-heading); font-family: var(--font-display); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
             .project-title-popout { display: inline-block; transform-style: preserve-3d; transform: translateZ(20px) rotateX(-7deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.18), 2px 2px 0px rgba(0,0,0, 0.15), 3px 3px 0px rgba(0,0,0, 0.12), 4px 4px 0px rgba(0,0,0, 0.09), 0 0 20px rgba(var(--accent-highlight-rgb), 0.4); transition: text-shadow 0.3s ease-out, transform 0.3s ease-out; }
             .project-title-popout:hover { transform: translateZ(24px) rotateX(-8deg); text-shadow: 1px 1px 0px rgba(0,0,0, 0.22), 2px 2px 0px rgba(0,0,0, 0.20), 3px 3px 0px rgba(0,0,0, 0.18), 4px 4px 0px rgba(0,0,0, 0.16), 5px 5px 0px rgba(0,0,0, 0.14), 0 0 25px rgba(var(--accent-highlight-rgb), 0.5); }
             .project-description { font-size: clamp(1rem, 2.1vw, 1.2rem); color: var(--text-secondary); margin-top: 0.8rem; margin-bottom: 1.8rem; max-width: 70ch; line-height: 1.7; opacity: 0.95; }
             .action-buttons { /* Use global button styles */ }

             /* --- Visuals --- */
             .project-visuals { margin-bottom: 2rem; }
             .themed-box.project-visuals { border-color: var(--bg-tertiary); border-radius: var(--radius-lg); }
             .main-image-wrapper { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: inherit; }
             .visual-image { display: block; width: 100%; height: 100%; object-fit: cover; }
             .sub-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.8rem; padding: 0.8rem; border-top: 1px solid rgba(var(--accent-highlight-rgb), 0.1); }
             .sub-gallery-item { border-radius: var(--radius-base); overflow: hidden; border: 1px solid var(--bg-tertiary); transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: var(--shadow-low); cursor: pointer; }
             .sub-gallery-item:hover { transform: scale(1.04); z-index: 2; box-shadow: var(--shadow-medium); }
             .sub-gallery-image { display: block; width: 100%; height: 100%; object-fit: cover; }
             .placeholder-visuals { border: 2px dashed rgba(var(--accent-secondary-rgb), 0.4); border-radius: var(--radius-xl); padding: 2rem; background: rgba(var(--bg-secondary-rgb), 0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem; }
             .placeholder-icon { color: var(--accent-secondary); opacity: 0.3; }
             .ascii-placeholder-detail { color: var(--accent-secondary); opacity: 0.4; font-size: 0.7rem; line-height: 1.1; }


             /* --- Prose/Content Styles --- */
              .prose-custom { line-height: 1.75; font-size: 1.05rem; color: var(--text-primary); }
              .prose-custom :where(p) { color: var(--text-secondary); margin-bottom: 1.3em; }
              .prose-custom :where(a) { color: var(--accent-highlight); text-decoration: none; border-bottom: 1px dashed rgba(var(--accent-highlight-rgb), 0.5); transition: all 0.2s ease; }
              .prose-custom :where(a:hover) { color: var(--text-bright); border-bottom-style: solid; border-bottom-color: var(--accent-highlight); background: rgba(var(--accent-highlight-rgb), 0.1); }
              .prose-custom :where(strong) { color: var(--text-bright); font-weight: 600; }
              .prose-custom :where(h2) { font-size: 1.8em; margin-top: 2.2em; margin-bottom: 1em; color: var(--text-heading); font-family: var(--font-display); font-weight: 700; border-bottom: 2px solid rgba(var(--accent-primary-rgb), 0.4); padding-bottom: 0.4em; letter-spacing: 0.01em; text-shadow: 1px 1px 0 rgba(0,0,0,0.2); scroll-margin-top: 80px; /* Offset for sticky nav */ }
              .prose-custom :where(h3) { font-size: 1.4em; margin-top: 2em; margin-bottom: 0.8em; color: var(--text-heading); font-family: var(--font-display); font-weight: 600; border-left: 3px solid var(--accent-secondary); padding-left: 0.5em; scroll-margin-top: 80px; /* Offset for sticky nav */ }
              /* Add scroll-margin-top to other heading levels if needed */
              .prose-custom :where(h4), .prose-custom :where(h5), .prose-custom :where(h6) { scroll-margin-top: 80px; color: var(--text-heading); }
              .prose-custom :where(code):not(pre code) { font-family: var(--font-mono); font-size: 0.875em; background-color: rgba(var(--accent-secondary-rgb), 0.15); color: var(--accent-secondary); padding: 0.25em 0.5em; border-radius: 4px; border: 1px solid rgba(var(--accent-secondary-rgb), 0.3); word-wrap: break-word; }
              .prose-custom :where(pre) { background-color: rgba(var(--bg-code, var(--bg-secondary-rgb)), 0.95); border: 1px solid var(--bg-tertiary); border-radius: var(--radius-base); padding: 1.2em 1.5em; overflow-x: auto; box-shadow: var(--shadow-inset); backdrop-filter: blur(4px); }
              .prose-custom :where(pre code) { background-color: transparent; border: none; padding: 0; color: var(--text-code, var(--text-secondary)); font-size: 0.9em; line-height: 1.6; }
              .prose-custom :where(blockquote) { border-left: 4px solid var(--accent-primary); padding: 1em 1.5em; margin: 1.5em 0; font-style: normal; background: rgba(var(--accent-primary-rgb), 0.08); border-radius: 0 var(--radius-lg) var(--radius-lg) 0; color: var(--text-secondary); box-shadow: inset 3px 0 8px rgba(var(--accent-primary-rgb), 0.1); }
              .prose-custom :where(ul > li)::marker { color: var(--accent-primary); }
              .prose-custom :where(ol > li)::marker { color: var(--accent-primary); font-weight: 600; }
              .prose-custom :where(hr) { border-color: rgba(var(--accent-highlight-rgb), 0.2); margin: 3em auto; }

             /* --- Themed Box --- */
             .themed-box { border: 1px solid rgba(var(--accent-highlight-rgb), 0.15); border-radius: var(--radius-lg); background: linear-gradient(rgba(var(--bg-secondary-rgb), 0.6), rgba(var(--bg-tertiary-rgb), 0.7)); backdrop-filter: blur(7px); box-shadow: var(--shadow-low); overflow: hidden; transition: border-color 0.3s, box-shadow 0.3s; }
             .themed-box:hover { border-color: rgba(var(--accent-highlight-rgb), 0.3); box-shadow: var(--shadow-medium); }
             .box-header { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.3rem; background: rgba(var(--bg-tertiary-rgb), 0.5); border-bottom: 1px solid rgba(var(--accent-highlight-rgb), 0.15); transition: background-color 0.2s; }
             .box-header.simple { background: none; border-bottom: 1px dashed rgba(var(--accent-highlight-rgb), 0.15); padding: 0.6rem 0; margin: 0 1.3rem; }
             .collapsible-header { width: 100%; background: none; border: none; text-align: left; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: space-between; }
             .collapsible-header:hover { background: rgba(var(--accent-highlight-rgb), 0.05); }
             .header-left { display: flex; align-items: center; gap: 0.8rem; }
             .header-right { display: flex; align-items: center; gap: 0.8rem; }
             .header-icon { color: var(--accent-highlight); opacity: 0.9; flex-shrink: 0; }
             .box-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; color: var(--text-heading); margin: 0; line-height: 1.2; }
             .loading-indicator { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); font-style: italic; opacity: 0.8; animation: pulse-bg 1.5s infinite alternate; }
             .error-icon { color: var(--accent-alert); }
             .chevron-icon { color: var(--text-muted); transition: transform 0.25s ease-out; }
             .chevron-icon.open { transform: rotate(180deg); }
             .box-content { padding: 1.3rem 1.5rem; }


             /* --- GitHub Insights --- */
             .github-insights .stat-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-secondary); line-height: 1.5; border-bottom: 1px solid rgba(var(--bg-tertiary-rgb), 0.7); padding-bottom: 0.6rem; }
             .stat-item .icon { flex-shrink: 0; opacity: 0.8; width: 16px; height: 16px; }
             .stat-item span { opacity: 0.9; min-width: 80px; color: var(--text-muted); }
             .stat-item strong { color: var(--text-primary); font-weight: 600; word-break: break-word; }
             .stat-item strong a { color: var(--accent-highlight); text-decoration: none; border-bottom: 1px dotted currentColor; transition: color 0.2s, border-color 0.2s; }
             .stat-item strong a:hover { color: var(--text-bright); border-bottom-color: var(--accent-highlight); border-bottom-style: solid; }
             .language-section, .contributors-section { margin-top: 1.2rem; padding-top: 1.2rem; border-top: 1px dashed rgba(var(--accent-highlight-rgb), 0.2); }
             .sub-heading { font-family: var(--font-mono); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 0.8rem; opacity: 0.9; border-left: 3px solid var(--accent-highlight); padding-left: 0.6em; }
             .language-bars { display: flex; flex-direction: column; gap: 0.5rem; }
             .language-bar-item { font-size: 0.8rem; font-family: var(--font-mono); }
             .lang-label { display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.9em; }
             .lang-percent { opacity: 0.7; font-size: 0.9em; }
             .lang-bar-bg { width: 100%; height: 8px; background-color: rgba(var(--bg-tertiary-rgb), 0.8); border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.25); }
             .lang-bar-fg { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-highlight)); border-radius: 4px; transition: width 0.6s ease-out; box-shadow: 0 0 5px rgba(var(--accent-highlight-rgb), 0.3); }
             .language-more-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem; font-style: italic; text-align: right; }
             .contributor-list { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
             .contributor-item { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(var(--bg-secondary-rgb), 0.7); padding: 0.3rem 0.7rem 0.3rem 0.3rem; border-radius: 99px; border: 1px solid var(--bg-tertiary); transition: all 0.2s ease; text-decoration: none; }
             .contributor-item:hover { background: var(--bg-tertiary); border-color: var(--accent-primary); transform: translateY(-1px); box-shadow: var(--shadow-low); }
             .contributor-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-primary); }
             .contributor-login { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); transition: color 0.2s ease; }
             .contributor-item:hover .contributor-login { color: var(--accent-primary); }
             .contributor-more { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); padding-left: 0.6rem; font-style: italic; }
             .error-message { font-family: var(--font-mono); color: var(--accent-alert); background: rgba(var(--accent-alert-rgb), 0.1); border: 1px solid rgba(var(--accent-alert-rgb), 0.3); padding: 0.8rem 1rem; border-radius: var(--radius-base); text-align: center; font-size: 0.85rem; }
             .loading-placeholder { font-family: var(--font-mono); color: var(--text-muted); padding: 1.5rem; border: 1px dashed var(--bg-tertiary); text-align: center; border-radius: var(--radius-base); background: rgba(var(--bg-secondary-rgb), 0.6); animation: pulse-bg 1.5s infinite alternate; font-size: 0.9rem; }
             @keyframes pulse-bg { from { opacity: 0.6; } to { opacity: 0.9; } }


             /* --- Team Section --- */
             .team-section .box-header .icon { color: var(--accent-secondary); }
             .team-member { display: flex; align-items: center; gap: 0.8rem; background-color: rgba(var(--bg-secondary-rgb), 0.7); padding: 0.6rem 0.8rem; border-radius: var(--radius-base); border: 1px solid var(--bg-tertiary); transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
             .team-member:hover { background-color: rgba(var(--bg-tertiary-rgb), 0.9); border-color: rgba(var(--accent-secondary-rgb), 0.4); transform: translateY(-1px); }
             .team-photo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-primary); flex-shrink: 0; }
             .team-photo-placeholder { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-secondary); border: 1px solid var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
             .member-info { display: flex; flex-direction: column; line-height: 1.3; flex-grow: 1; }
             .member-name { font-weight: 600; color: var(--text-heading); font-size: 0.9rem; }
             .member-role { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.9; }
             .member-link { color: var(--text-muted); margin-left: auto; padding: 0.3rem; border-radius: 50%; transition: color var(--transition-fast), background-color var(--transition-fast); display: inline-flex; align-items: center; justify-content: center; }
             .member-link:hover { color: var(--accent-highlight); background-color: rgba(var(--accent-highlight-rgb), 0.1); }

             /* --- Tags Section --- */
             .tags-heading { font-family: var(--font-mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.1em; margin-bottom: 0.8rem; border-bottom: 1px dashed var(--bg-tertiary); padding-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem; }
             .tags-list { display: flex; flex-wrap: wrap; gap: 0.6rem; }
             .tags-list .tag-chip { background-color: rgba(var(--accent-muted1-rgb), 0.25); color: var(--accent-muted1); border-color: rgba(var(--accent-muted1-rgb), 0.4); font-size: 0.8rem; padding: 4px 10px; border-radius: 4px; box-shadow: 1px 1px 1px rgba(0,0,0,0.1); cursor: default; }
             .tags-list .tag-chip:hover { background-color: rgba(var(--accent-muted1-rgb), 0.4); color: var(--text-bright); }

             /* --- Testimonials Section --- */
              .testimonials-section { margin-top: 2rem; }
              .testimonials-section .section-heading { font-size: 1.6rem; color: var(--accent-secondary); }
              .testimonials-section .section-heading .icon { color: currentColor; }
              .testimonial-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
              .testimonial-item { background: rgba(var(--bg-secondary-rgb), 0.7); border-left: 4px solid var(--accent-secondary); padding: 1.5rem; border-radius: 0 var(--radius-lg) var(--radius-lg) 0; box-shadow: var(--shadow-low); backdrop-filter: blur(4px); border: 1px solid var(--bg-tertiary); }
              .testimonial-quote { font-style: italic; color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem; position: relative; padding-left: 1.5rem; font-size: 1rem; }
              .testimonial-quote::before { content: '“'; position: absolute; left: -0.2rem; top: -0.5rem; font-size: 3rem; color: var(--accent-secondary); opacity: 0.6; line-height: 1; font-weight: bold; }
              .testimonial-author { font-weight: 600; color: var(--text-heading); font-size: 0.9rem; display: block; text-align: right; margin-top: 1rem; }
              .testimonial-role { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.8; display: block; text-align: right; }


             /* --- Related Projects --- */
             .related-projects { border-top: 1px dashed var(--bg-tertiary); padding-top: 2.5rem; margin-top: 3rem; }
             .related-heading { font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; letter-spacing: 0.05em; opacity: 0.9; text-shadow: 0 0 5px rgba(var(--accent-secondary-rgb), 0.2); }
             .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: 1.2rem; }

             /* --- Common Buttons & Links --- */
             .btn-glow, .btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.4rem; border-radius: 4px; font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; border: 1px solid transparent; text-decoration: none; line-height: 1; }
             .btn-glow { background: linear-gradient(45deg, var(--accent-primary), var(--accent-highlight)); color: var(--bg-primary); border-color: transparent; text-shadow: 1px 1px 1px rgba(0,0,0,0.5); box-shadow: 0 0 12px rgba(var(--accent-primary-rgb), 0.7), 0 0 20px rgba(var(--accent-highlight-rgb), 0.4), 2px 2px 3px rgba(0,0,0, 0.3); }
             .btn-glow:hover { filter: brightness(1.15); box-shadow: 0 0 16px rgba(var(--accent-primary-rgb), 0.9), 0 0 25px rgba(var(--accent-highlight-rgb), 0.6), 3px 3px 4px rgba(0,0,0, 0.3); transform: translateY(-1px) scale(1.01); }
             .btn-outline { border: 1px solid var(--accent-secondary); color: var(--accent-secondary); background: rgba(var(--bg-secondary-rgb), 0.4); backdrop-filter: blur(3px); }
             .btn-outline:hover { background: rgba(var(--accent-secondary-rgb), 0.2); color: var(--text-bright); border-color: var(--accent-highlight); box-shadow: 0 0 10px rgba(var(--accent-secondary-rgb), 0.3); transform: translateY(-1px); }
             .text-shadow-glow { text-shadow: 0 0 10px rgba(var(--accent-primary-rgb), 0.6), 0 0 18px rgba(var(--accent-highlight-rgb), 0.3); }
             .link-hover { color: var(--accent-highlight); border-bottom: 1px dotted currentColor; transition: color 0.2s, border-color 0.2s; display: inline; }
             .link-hover:hover { color: var(--text-bright); border-bottom-color: var(--accent-highlight); border-bottom-style: solid; }
             .tag-chip { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; text-transform: uppercase; background-color: rgba(var(--accent-muted1-rgb), 0.25); color: var(--accent-muted1); border: 1px solid rgba(var(--accent-muted1-rgb), 0.4); font-family: var(--font-mono); transition: all var(--transition-fast); box-shadow: var(--shadow-inset-light); line-height: 1.4; }
             .tag-chip:hover { background-color: rgba(var(--accent-muted1-rgb), 0.4); color: var(--text-bright); border-color: var(--accent-muted1); }

        `}</style>
    </main>
  );
}