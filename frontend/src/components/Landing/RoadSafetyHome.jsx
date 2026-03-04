const RoadSafetyPanel = ({ deathStats }) => {
  return (
    <div className="relative h-[500px] overflow-hidden font-sans">
      <div className="flex h-full relative">
        <div
          className="relative hidden lg:flex w-full lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://www.tac.vic.gov.au/__data/assets/git_bridge/0019/313327/static/files/tac-stats.png')",
            clipPath: "polygon(0 0, 100% 0, 65% 100%, 0 100%)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="relative z-10 flex flex-col justify-center items-center h-full px-10">
              {deathStats?.stats?.slice(0,2).map((s, i) => (
                <div key={i} className="mb-10 text-center">
                  <h4 className="text-white text-[15px] font-medium mb-2">
                    {s.subtitle}
                  </h4>
                  <span className="text-white text-[72px] leading-none font-bold">
                    {s.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative flex lg:hidden w-full lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://www.tac.vic.gov.au/__data/assets/git_bridge/0019/313327/static/files/tac-stats.png')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full w-full px-10">
            {/* 2025 */}
            <div className="mb-10">
              <h4 className="text-white text-[15px] font-medium mb-2">
                Lives lost in 2025 to date
              </h4>
              <div className="flex items-end">
                <span className="text-white text-[72px] leading-none font-bold mr-3">
                  143
                </span>
              </div>
            </div>

            {/* 2024 */}
            <div className="mb-10">
              <h4 className="text-white text-[15px] font-medium mb-2">
                Lives lost in 2024 to date
              </h4>
              <span className="text-white text-[72px] leading-none font-bold">
                131
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Message */}
        <div className="w-1/2 hidden lg:flex items-center bg-white">
          <div className="px-12 py-12 max-w-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Working towards safer roads
            </h2>
            <div className="space-y-4 text-base text-gray-800 leading-relaxed">
              <p>
                We along with our road safety partners are working to achieve
                the vision of no deaths or serious injuries on our roads. We are
                moving towards a future where every journey is a safe one.
              </p>
              <p className="font-semibold">
                It is not acceptable to see death or serious injuries as
                inevitable on our roads.
              </p>
              <a
                href="https://www.tac.vic.gov.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold text-sm uppercase tracking-wide pt-2"
              >
                Find out more about road safety
                <svg
                  className="w-4 h-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadSafetyPanel;
