import { Hero } from '../components/Hero'
import { Skills } from '../components/Skills'
import { Experience } from '../components/Experience'
import { Projects } from '../components/Projects'
import { Certifications } from '../components/Certifications'

export function Home() {
  return (
    <div className="mx-auto flex w-full flex-1 min-h-0 max-w-7xl flex-col px-6">

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-12 py-3 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1.2fr)_240px]">

        {/* ================= LEFT - PROJECTS ================= */}
        <aside className="min-w-0">
          <section
            id="projects"
            className="scroll-mt-24"
          >
            <Projects />
          </section>
        </aside>


        {/* ================= CENTER ================= */}
        <main className="min-w-0">

          {/* Hero */}
          <section
            id="home"
            className="scroll-mt-24"
          >
            <Hero />
          </section>

          {/* Skills */}
          <section
            id="skills"
            className="mt-6 scroll-mt-24"
          >
            <Skills />
          </section>

        </main>


        {/* ================= RIGHT ================= */}
        <aside className="min-w-0">

          {/* Experience */}
          <section
            id="experience"
            className="scroll-mt-24"
          >
            <Experience />
          </section>

          {/* Certifications */}
          <section
            id="certifications"
            className="mt-10 scroll-mt-24"
          >
            <Certifications />
          </section>

        </aside>

      </div>


      {/* ================= CONTACT ================= */}
      {/* <section
        id="contact"
        className="mt-auto border-t border-slate-800 py-2 scroll-mt-24"
      >
        <Contact />
      </section> */}

    </div>
  )
}