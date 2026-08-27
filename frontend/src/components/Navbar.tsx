import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../lib/navigation'
import { useProfile } from '../hooks/useProfile'
import { ThemeToggle } from './ThemeToggle'
import { ExternalLink, Mail } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const profileState = useProfile()
  const name = profileState.status === 'success' ? profileState.data.name : ''
  const resumeUrl = profileState.status === 'success' ? profileState.data.resumeUrl : ''
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const githubUrl = profileState.status === 'success' ? profileState.data.githubUrl : ''
  const linkedinUrl = profileState.status === 'success' ? profileState.data.linkedinUrl : ''
  const email = profileState.status === 'success' ? profileState.data.email : ''

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/#home"
          className="text-lg font-semibold text-slate-900 dark:text-slate-50"
        >
          {name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
           <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    GitHub
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    LinkedIn
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Mail size={14} aria-hidden="true" />
                    Email
                  </a>
        </nav>
       
        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Resume
          </a>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 lg:hidden dark:text-slate-200"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-4 pb-4 lg:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/#${link.id}`}
                  onClick={closeMobileMenu}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="mt-2 block rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
              >
                Resume
              </a>
            </li>
          </ul>
          <div className="mt-3 flex justify-center">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}
