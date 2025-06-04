export default function WorkExperience() {
  return (
    <div className="w-full max-w-5xl mb-10">
      <h3 className="font-semibold text-xl mb-4">Work Experience</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#232323] p-5 rounded-xl border border-[#232323]">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
            <img src="/images/squirrel-logo.svg" alt="The Squirrel logo" className="w-8 h-8" />
          </div>
          <div>
            <div className="font-semibold text-base">The Squirrel</div>
            <div className="text-[#b5b5b5] text-sm">Next JS Developer</div>
          </div>
        </div>
        <div className="text-[#b5b5b5] text-sm mt-3 sm:mt-0">Nov 2024 - Present</div>
      </div>
    </div>
  );
}
