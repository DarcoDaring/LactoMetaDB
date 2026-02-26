import "./Team.css";

function Team() {
  const team = [
    {
      image: "/images/vidya.jpeg",
      name: "Dr. Vidya Niranjan",
    linkedin: "https://www.linkedin.com/in/vidya-niranjan",
    
  },
  {
    image: "/images/Pooja.jpeg",
      name: "Pooja SureshKumar",
    linkedin: "https://www.linkedin.com/in/t-s-pooja-sree",
  },
   {
    image: "/images/Likitha.jpeg",
      name: "Dr. Likitha S",
    linkedin: "https://www.linkedin.com/in/likitha-s-055762181",
  },
  {
    image: "/images/Anagha.jpeg",
      name: "Dr. Anagha S Setlur",
    linkedin: "https://www.linkedin.com/in/anagha-s-setlur",
  },
  {
    image: "/images/Chandrashekar.jpeg",
      name: "Dr. Chandrashekar K",
    linkedin: "https://www.linkedin.com/in/chandrashekar-karunakaran-achari",
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
            
            <img 
  src={member.image} 
  alt={member.name} 
  className="member-img"
/>
            <h3>{member.title}</h3>
            <p className="member-name">{member.name}</p>

            <div className="social-links">
              <a
  href={member.linkedin}
  target="_blank"
  rel="noreferrer"
  className="linkedin-btn"
>
  LinkedIn
</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Team;
