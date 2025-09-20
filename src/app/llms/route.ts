export async function GET() {
  const summary = `Davidson Rafael - Portfolio & Blog

Davidson Rafael is a passionate developer specializing in modern web development with expertise in Next.js, React, TypeScript, and TailwindCSS. This portfolio showcases his technical skills, projects, and programming insights.

ABOUT
Davidson advocates for efficiency in development, preferring Vim's keystroke commands for editing, tabs for flexible indentation, static typing for cleaner code, and dark mode for comfortable coding sessions. He believes in the power of modern web technologies to create fast, accessible, and SEO-optimized applications.

PROJECTS
• Portfolio & Blog: A modern, fast, and SEO-optimized portfolio built with Next.js 15, featuring MDX blog posts, dark mode, and excellent performance scores. Technologies: Next.js 15, React 19, TypeScript, TailwindCSS, MDX, Shiki.
• Task Management App: Full-stack application with real-time updates, drag-and-drop functionality, and team collaboration features using React, Node.js, PostgreSQL, Socket.io, and Prisma.
• Weather Dashboard: Beautiful weather application with location-based forecasts, interactive charts, and responsive design built with Vue.js, Chart.js, and OpenWeather API.

BLOG CONTENT
Technical articles covering web development, programming best practices, and developer tools:
• "Embracing Vim: The Unsung Hero of Code Editors" - Explores Vim's efficiency, customization capabilities, ubiquity across platforms, and strong community support for modern development workflows.
• "Spaces vs. Tabs: The Indentation Debate Continues" - Examines the ongoing debate between spaces and tabs for code indentation, discussing consistency, readability, flexibility, and team dynamics in software development.
• "Perancangan Basis Data" - Discusses database design principles, normalization, indexing, and best practices for creating efficient and scalable databases.

TECHNICAL EXPERTISE
Specialized in React ecosystem, TypeScript, Next.js, TailwindCSS, MDX content management, modern build tools, and responsive web design. Advocates for developer experience, code quality, and performance optimization.`;

  return new Response(summary, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
