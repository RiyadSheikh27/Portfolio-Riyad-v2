// src/api/index.js
// -----------------------------------------------------------------------------
// This is the ONLY file in the app that imports portfolio.json directly.
// Every component that needs data imports it from here instead of reaching
// into the JSON file itself. That indirection means:
//   - If the data source ever changes (e.g. moves to a real API call), only
//     this file needs to change — components stay untouched.
//   - Components never hardcode content; they always ask this module for it.
// -----------------------------------------------------------------------------
import portfolioData from './portfolio.json'

export const meta = portfolioData.meta
export const socialLinks = portfolioData.socialLinks
export const intro = portfolioData.intro
export const experience = portfolioData.experience
export const skills = portfolioData.skills
export const competitiveProgramming = portfolioData.competitiveProgramming
export const projects = portfolioData.projects
export const education = portfolioData.education
export const writing = portfolioData.writing
