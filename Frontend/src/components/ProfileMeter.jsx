const ProfileMeter = ({ studentData }) => {
  const s = studentData || {};
  const total = s.profileCompletion || 0;

  const sections = [
    {
      label: "Basic Info", weight: 20,
      earned: (s.firstName?5:0)+(s.lastName?5:0)+(s.phone?5:0)+(s.dob?5:0),
      max: 20
    },
    {
      label: "Academic Info", weight: 25,
      earned: (s.education?10:0)+(s.qualification?10:0)+(s.passingYear?5:0),
      max: 25
    },
    {
      label: "University Preferences", weight: 15,
      earned: (s.preferredCountry?8:0)+(s.intakeYear?7:0),
      max: 15
    },
    {
      label: "Documents", weight: 20,
      earned: (s.passport?7:0)+(s.sop?7:0)+(s.lor?6:0),
      max: 20
    },
    {
      label: "Financial Info", weight: 10,
      earned: (s.fatherName?5:0)+(s.motherName?5:0),
      max: 10
    },
    {
      label: "Visa Info", weight: 10,
      earned: (s.visaType ? 5:0)+
      ((s.ieltsScore || s.toeflScore || s.pteScore ? 5:0)),
      max: 10
    }
  ];

  const color = total >= 80 ? "#10b981" : total >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-6 border">

      {/* Overall */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-semibold text-gray-700">Profile Completion</p>
        <p className="text-lg font-bold" style={{ color }}>{total}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
        <div className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${total}%`, background: color }} />
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {total >= 80 ? "✅ Almost complete!" : total >= 50 ? "⚠️ Keep filling your profile" : "❌ Please complete your profile"}
      </p>

      {/* Section wise */}
      <div className="flex flex-col gap-3">
        {sections.map((sec) => {
          const pct = Math.round((sec.earned / sec.max) * 100);
          const secColor = sec.earned === sec.max ? "#10b981" : pct > 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={sec.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {sec.earned === sec.max ? "✅" : "⏳"} {sec.label}
                  <span className="text-gray-400 font-normal ml-1">({sec.weight}% weight)</span>
                </span>
                <span className="text-xs font-bold" style={{ color: secColor }}>
                  {sec.earned}/{sec.max} pts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: secColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMeter;