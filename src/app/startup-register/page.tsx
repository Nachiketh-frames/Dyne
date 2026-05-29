export default function StartupRegisterPage() {
    return (
      <main className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Register Your Startup
            </h1>
  
            <p className="text-[#8B949E] mt-3">
              Apply to raise capital through DYNE
            </p>
          </div>
  
          <form className="space-y-6">
            <InputField
              label="Startup Name"
              placeholder="HealthSync"
            />
  
            <InputField
              label="Founder Name"
              placeholder="Arjun Mehta"
            />
  
            <InputField
              label="Industry"
              placeholder="HealthTech"
            />
  
            <InputField
              label="Funding Goal"
              placeholder="₹25,00,000"
            />
  
            <div>
              <label className="block text-sm text-[#8B949E] mb-2">
                Startup Description
              </label>
  
              <textarea
                placeholder="Describe your startup..."
                rows={5}
                className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-[#2962FF] hover:bg-[#3B73FF] py-4 rounded-xl font-semibold transition"
            >
              Submit Application
            </button>
          </form>
        </div>
      </main>
    )
  }
  
  function InputField({
    label,
    placeholder,
  }: {
    label: string
    placeholder: string
  }) {
    return (
      <div>
        <label className="block text-sm text-[#8B949E] mb-2">
          {label}
        </label>
  
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
        />
      </div>
    )
  }