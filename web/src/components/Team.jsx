import "./Team.css";

function Team() {
  const team = [
    {
      title: "Research Supervisor",
      name: "Dr. Vidhya Niranjan",
      email: "vidhya@example.com",
      linkedin: "https://linkedin.com",
    },
    {
      title: "Research Scholar",
      name: "Pooja Suresh Kumar",
      email: "pooja@example.com",
      linkedin: "https://linkedin.com",
    },
    {
      title: "Data Curator",
      name: "Likitha S",
      email: "likitha@example.com",
      linkedin: "https://linkedin.com",
    },
    {
      title: "Alpha & Beta Tester",
      name: "Dr. Anagha S Setlur, Chandrashekar K",
      email: "tester@example.com",
      linkedin: "https://linkedin.com",
    },
  ];

  return (
    <section className="team" id="projects">
      <h2 className="team-title">Our Team</h2>
      <p className="team-subtitle">
        The people behind LactoMetaDb
      </p>

      <div className="team-list">
        {team.map((member, index) => (
          <div className="project-card" key={index}>
            <h3>{member.title}</h3>
            <p className="member-name">{member.name}</p>

            <div className="social-links">
              <a href={`mailto:${member.email}`} title="Email">
                ✉️
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                🔗
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
