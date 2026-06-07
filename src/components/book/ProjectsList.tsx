type ProjectItem = {
  id: string
  name: string
  tech: string
  description: string
}

export function ProjectsList({ projects }: { projects: ProjectItem[] }) {
  return (
    <ul className="book-projects">
      {projects.map((project, index) => {
        const tags = project.tech.split(' · ').map((tag) => tag.trim())

        return (
          <li key={project.id} className="book-project">
            <div className="book-project-head">
              <span className="book-project-num">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="book-project-title">{project.name}</h3>
            </div>
            <ul className="book-project-tags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <p className="book-project-desc">{project.description}</p>
          </li>
        )
      })}
    </ul>
  )
}
