import Link from "next/link";

const portalSections = [
  {
    title: "AI Tutor",
    description: "Practice English answers and interview coaching with the AI chat module.",
    href: "/ai-tutor",
  },
  {
    title: "Interview Tracker",
    description: "Track your interview pipeline and update statuses for each round.",
    href: "/interview-tracker",
  },
  {
    title: "Resume Builder",
    description: "Create a strong resume draft with summary, skills, and experience sections.",
    href: "/resume-builder",
  },
  {
    title: "Job Search Dashboard",
    description: "Manage applications and monitor your job search progress in one place.",
    href: "/job-search",
  },
  {
    title: "Study Planner",
    description: "Plan study tasks, set timelines, and stay consistent with your prep.",
    href: "/study-planner",
  },
  {
    title: "Analytics",
    description: "View aggregate usage and session insights for the entire career prep portal.",
    href: "/dashboard",
  },
];

const featureHighlights = [
  {
    title: "Career prep in one place",
    content:
      "AI coaching, job tracking, resume creation, and scheduled practice all live together for a complete preparation workflow.",
  },
  {
    title: "From practice to application",
    content:
      "Start with interview coaching, then switch to resume editing, job tracking, and planning your next study session.",
  },
  {
    title: "All data stays local",
    content:
      "Your progress and saved sessions are stored in your browser so you can work without needing a backend database yet.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">
              Career Prep Portal
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              All your career preparation tools in one homepage.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Access the AI Tutor, resume builder, interview tracker, job search dashboard, study planner, and analytics directly from the home page.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {portalSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-xl font-semibold text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {section.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
                Open {section.title} →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-3xl font-semibold">Portal features</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {feature.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-3xl font-semibold">Use the portal</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Your home page now surfaces every module with a direct call to action. Start with the AI Tutor to practice answers, then use the resume builder and tracker to turn practice into results.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <p>• AI Tutor chat for live coaching and feedback.</p>
              <p>• Interview tracker to keep your rounds organized.</p>
              <p>• Resume builder to write and preview your profile.</p>
              <p>• Job search dashboard to capture roles and offer status.</p>
              <p>• Study planner to schedule consistent preparation.</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-100 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-3xl font-semibold">Start now</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Choose a module below and jump right into the tool you need.
            </p>
            <div className="mt-6 grid gap-3">
              {portalSections.slice(0, 3).map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
