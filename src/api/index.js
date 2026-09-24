// src/api/index.js
// -----------------------------------------------------------------------------
// This is the ONLY file in the app that imports the JSON data files
// (portfolio.json and chatbot.json) directly.
// Every component that needs data imports it from here instead of reaching
// into the JSON file itself. That indirection means:
//   - If the data source ever changes (e.g. moves to a real API call), only
//     this file needs to change — components stay untouched.
//   - Components never hardcode content; they always ask this module for it.
// -----------------------------------------------------------------------------
import portfolioData from './portfolio.json'
import chatbotData from './chatbot.json'

export const meta = portfolioData.meta
export const socialLinks = portfolioData.socialLinks
export const intro = portfolioData.intro
export const experience = portfolioData.experience
export const skills = portfolioData.skills
export const competitiveProgramming = portfolioData.competitiveProgramming
export const projects = portfolioData.projects
export const education = portfolioData.education
export const writing = portfolioData.writing
export const publications = portfolioData.publications
export const extracurricular = portfolioData.extracurricular
export const certificates = portfolioData.certificates

// Scripted Q&A for the footer ChatBot (components/sections/ChatBot.jsx).
export const chatbot = chatbotData

// Every page section, in on-page order (by sectionNum), for the Header's
// SectionNav: { sectionNum, sectionName, navLabel }. Derived from the data above, so adding or renumbering a
// section in portfolio.json updates the nav automatically.
export const sections = [
  intro,
  experience,
  skills,
  competitiveProgramming,
  projects,
  education,
  writing,
  publications,
  extracurricular,
  certificates,
]
  // navLabel is an optional short name for the nav (e.g. "ECA"); the
  // section itself always shows its full sectionName.
  .map(({ sectionNum, sectionName, navLabel }) => ({
    sectionNum,
    sectionName,
    navLabel: navLabel ?? sectionName,
  }))
  .sort((a, b) => a.sectionNum.localeCompare(b.sectionNum))
