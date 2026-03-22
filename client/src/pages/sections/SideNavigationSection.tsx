import { useState } from "react";

// Navigation items data
const navItems = [
  {
    label: "Calendar",
    iconSrc: "/figmaAssets/container-2.svg",
    active: true,
  },
  {
    label: "Patient",
    iconSrc: "/figmaAssets/container-21.svg",
    active: false,
  },
  {
    label: "Billing",
    iconSrc: "/figmaAssets/container-10.svg",
    active: false,
  },
  {
    label: "Claims",
    iconSrc: "/figmaAssets/container-8.svg",
    active: false,
  },
  {
    label: "Reports",
    iconSrc: "/figmaAssets/container-9.svg",
    active: false,
  },
  {
    label: "EHR",
    iconSrc: "/figmaAssets/container-5.svg",
    active: false,
  },
];

export const SideNavigationSection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState<string>("Calendar");

  return (
    <nav className="flex flex-col w-56 min-h-screen items-start bg-white border-r border-border">
      {/* Header */}
      <div className="flex w-full h-[50px] items-center justify-between px-[10.5px] py-0 border-b border-border">
        <div className="flex items-center gap-[7px]">
          {/* Logo icon */}
          <div className="flex w-[24.5px] h-[24.5px] items-center justify-center rounded-[8.75px] bg-[linear-gradient(135deg,rgba(0,187,167,1)_0%,rgba(0,150,137,1)_100%)] shrink-0">
            <span className="text-[12.2px] tracking-[-0.02px] leading-[17.5px] [font-family:'Inter',Helvetica] font-normal text-white">
              M
            </span>
          </div>
          {/* Title */}
          <span className="[font-family:'Inter',Helvetica] font-normal text-[#101828] text-sm tracking-[-0.15px] leading-[21px] whitespace-nowrap">
            Navigation
          </span>
        </div>

        {/* Collapse button */}
        <img
          className="w-7 h-7 shrink-0"
          alt="Button"
          src="/figmaAssets/button-1.svg"
        />
      </div>

      {/* Navigation items */}
      <div className="flex flex-col w-full items-start gap-[3.5px] pt-[7px] pb-0 px-0 flex-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`flex h-[38.5px] items-center gap-[10.5px] px-[10.5px] py-0 w-full text-left cursor-pointer transition-colors ${
                isActive ? "bg-cyan-600" : "bg-transparent hover:bg-gray-50"
              }`}
            >
              <img
                className="w-[17.5px] h-[17.5px] shrink-0"
                alt={item.label}
                src={item.iconSrc}
              />
              <span
                className={`flex-1 text-sm tracking-[0] leading-[21px] [font-family:'Inter',Helvetica] font-medium whitespace-nowrap ${
                  isActive ? "text-white" : "text-[#4a5565]"
                }`}
              >
                {item.label}
              </span>
              <img
                className="w-3.5 h-3.5 shrink-0"
                alt="chevron"
                src="/figmaAssets/icon-3.svg"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
