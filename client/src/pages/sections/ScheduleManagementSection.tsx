import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Navigation menu items data
const navItems = [
  { label: "Calendar", active: true },
  { label: "Patient", active: false },
  { label: "Billing", active: false },
  { label: "Claims", active: false },
  { label: "Reports", active: false },
  { label: "EHR", active: false },
  { label: "Help", active: false },
];

// View toggle options
const viewOptions = ["Day", "Week", "Month"];

// Stats summary data
const statsData = [
  {
    value: "12",
    label: "Total",
    valueColor: "text-[#101828]",
    bg: "bg-gray-50",
    border: "border",
    labelColor: "text-[#6a7282]",
  },
  {
    value: "8",
    label: "Scheduled",
    valueColor: "text-[#4a5565]",
    bg: "bg-gray-50",
    border: "border",
    labelColor: "text-[#6a7282]",
  },
  {
    value: "1",
    label: "Checked In",
    valueColor: "text-sky-700",
    bg: "bg-[#0369a10d]",
    border: "border-[#0369a133]",
    labelColor: "text-sky-700",
  },
  {
    value: "1",
    label: "In Progress",
    valueColor: "text-violet-600",
    bg: "bg-[#7c3aed0d]",
    border: "border-[#7c3aed33]",
    labelColor: "text-violet-600",
  },
  {
    value: "1",
    label: "Completed",
    valueColor: "text-emerald-600",
    bg: "bg-[#0596690d]",
    border: "border-[#05966933]",
    labelColor: "text-emerald-600",
  },
  {
    value: "1",
    label: "No-Show",
    valueColor: "text-amber-600",
    bg: "bg-[#d977060d]",
    border: "border-[#d9770633]",
    labelColor: "text-amber-600",
  },
];

// Status badge config
type StatusKey =
  | "CHECKED IN"
  | "SCHEDULED"
  | "IN PROGRESS"
  | "COMPLETED"
  | "NO SHOW";

const statusConfig: Record<
  StatusKey,
  { bg: string; border: string; text: string }
> = {
  "CHECKED IN": {
    bg: "bg-[#0369a11a]",
    border: "border-[#0369a14c]",
    text: "text-sky-700",
  },
  SCHEDULED: {
    bg: "bg-[#6b72801a]",
    border: "border-[#6b72804c]",
    text: "text-gray-400",
  },
  "IN PROGRESS": {
    bg: "bg-[#7c3aed1a]",
    border: "border-[#7c3aed4c]",
    text: "text-violet-500",
  },
  COMPLETED: {
    bg: "bg-[#0596691a]",
    border: "border-[#0596694c]",
    text: "text-emerald-500",
  },
  "NO SHOW": {
    bg: "bg-[#d977061a]",
    border: "border-[#d977064c]",
    text: "text-amber-500",
  },
};

// Location icon type
type LocationType = "room" | "virtual" | "phone";

// Appointment data
const appointments: {
  time: string;
  duration: string;
  initials: string;
  name: string;
  ageGender: string;
  visitType: string;
  description: string;
  status: StatusKey;
  locationType: LocationType;
  location: string;
}[] = [
  {
    time: "08:00 AM",
    duration: "30m",
    initials: "JS",
    name: "John Smith",
    ageGender: "45y / M",
    visitType: "Follow-up",
    description: "Diabetes Management Follow-up",
    status: "CHECKED IN",
    locationType: "room",
    location: "Room 101",
  },
  {
    time: "08:30 AM",
    duration: "15m",
    initials: "MG",
    name: "Maria Garcia",
    ageGender: "62y / F",
    visitType: "Annual Physical",
    description: "Annual Wellness Visit",
    status: "SCHEDULED",
    locationType: "room",
    location: "Room 102",
  },
  {
    time: "09:00 AM",
    duration: "20m",
    initials: "RJ",
    name: "Robert Johnson",
    ageGender: "38y / M",
    visitType: "Sick Visit",
    description: "Cough, congestion, fever x 3 days",
    status: "IN PROGRESS",
    locationType: "room",
    location: "Room 101",
  },
  {
    time: "09:30 AM",
    duration: "30m",
    initials: "SW",
    name: "Sarah Williams",
    ageGender: "29y / F",
    visitType: "Telehealth",
    description: "Anxiety medication follow-up",
    status: "SCHEDULED",
    locationType: "virtual",
    location: "Virtual",
  },
  {
    time: "10:00 AM",
    duration: "15m",
    initials: "MB",
    name: "Michael Brown",
    ageGender: "55y / M",
    visitType: "Lab Review",
    description: "Review recent lab results",
    status: "SCHEDULED",
    locationType: "room",
    location: "Room 103",
  },
  {
    time: "11:00 AM",
    duration: "30m",
    initials: "JD",
    name: "Jennifer Davis",
    ageGender: "41y / F",
    visitType: "New Patient",
    description: "Initial Consultation",
    status: "SCHEDULED",
    locationType: "room",
    location: "Room 102",
  },
  {
    time: "01:00 PM",
    duration: "20m",
    initials: "DM",
    name: "David Martinez",
    ageGender: "67y / M",
    visitType: "Follow-up",
    description: "Hypertension Management",
    status: "COMPLETED",
    locationType: "room",
    location: "Room 101",
  },
  {
    time: "01:30 PM",
    duration: "15m",
    initials: "LA",
    name: "Lisa Anderson",
    ageGender: "34y / F",
    visitType: "Phone Consult",
    description: "Prescription Refill",
    status: "SCHEDULED",
    locationType: "phone",
    location: "Phone",
  },
  {
    time: "02:00 PM",
    duration: "30m",
    initials: "JW",
    name: "James Wilson",
    ageGender: "52y / M",
    visitType: "Annual Physical",
    description: "Annual Wellness Visit",
    status: "SCHEDULED",
    locationType: "room",
    location: "Room 103",
  },
  {
    time: "02:30 PM",
    duration: "20m",
    initials: "PT",
    name: "Patricia Taylor",
    ageGender: "48y / F",
    visitType: "Sick Visit",
    description: "Migraine",
    status: "NO SHOW",
    locationType: "room",
    location: "Room 102",
  },
  {
    time: "03:00 PM",
    duration: "15m",
    initials: "CM",
    name: "Christopher Moore",
    ageGender: "31y / M",
    visitType: "Follow-up",
    description: "Ankle Sprain Follow-up",
    status: "SCHEDULED",
    locationType: "room",
    location: "Room 101",
  },
  {
    time: "03:30 PM",
    duration: "30m",
    initials: "AT",
    name: "Amanda Thomas",
    ageGender: "26y / F",
    visitType: "Telehealth",
    description: "Mental Health Consultation",
    status: "SCHEDULED",
    locationType: "virtual",
    location: "Virtual",
  },
];

// Location icon component
const LocationIcon = ({ type }: { type: LocationType }) => {
  if (type === "room") {
    return (
      <img
        className="w-[12.25px] h-[12.25px] flex-shrink-0"
        alt="Icon"
        src="/figmaAssets/icon.svg"
      />
    );
  }
  if (type === "virtual") {
    return (
      <img
        className="w-[12.25px] h-[12.25px] flex-shrink-0"
        alt="Icon"
        src="/figmaAssets/icon-4.svg"
      />
    );
  }
  // phone
  return (
    <img
      className="w-[12.25px] h-[12.25px] flex-shrink-0"
      alt="Icon"
      src="/figmaAssets/icon-13.svg"
    />
  );
};

export const ScheduleManagementSection = (): JSX.Element => {
  const [activeView, setActiveView] = useState("Day");
  const [activeNav, setActiveNav] = useState("Calendar");

  return (
    <div className="flex flex-col items-start flex-1 w-full">
      {/* Top Navigation Bar */}
      <header className="flex w-full items-center justify-between px-[21px] py-0 bg-white border-b border-solid border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] h-[67.5px]">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-[21px]">
          {/* Logo */}
          <div className="flex items-center gap-[7px]">
            <div className="flex w-7 h-7 items-center justify-center rounded-[8.75px] bg-[linear-gradient(135deg,rgba(0,187,167,1)_0%,rgba(0,150,137,1)_100%)] flex-shrink-0">
              <span className="[font-family:'Inter',Helvetica] font-normal text-white text-sm tracking-[-0.15px] leading-[21px]">
                M
              </span>
            </div>
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#101828] text-sm tracking-[-0.15px] leading-[21px] whitespace-nowrap">
              Medaea
            </span>
            <div className="bg-gray-100 rounded-[3.5px] px-[7px] py-0.5">
              <span className="[font-family:'Inter',Helvetica] font-normal text-[#6a7282] text-[10.5px] tracking-[0.09px] leading-[14px] whitespace-nowrap">
                AI
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center gap-[3.5px]">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-[6.75px] h-[31.5px] [font-family:'Inter',Helvetica] font-medium text-[12.2px] tracking-[-0.02px] leading-[17.5px] whitespace-nowrap transition-colors ${
                  activeNav === item.label
                    ? "bg-[#0891b21a] text-cyan-600"
                    : "text-[#364153]"
                }`}
              >
                {item.label}
                {activeNav === item.label && (
                  <img
                    className="w-3.5 h-3.5"
                    alt="Icon"
                    src="/figmaAssets/container.svg"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-[280px] h-8">
            <div className="flex w-[280px] h-8 items-center pl-[35px] pr-[10.5px] py-0 bg-[#1f2130] rounded-[6.75px]">
              <span className="[font-family:'Inter',Helvetica] font-normal text-[#99a1af] text-[12.2px] tracking-[-0.02px] leading-[normal] truncate">
                Search for patient, Charts, Reports or anything...
              </span>
            </div>
            <img
              className="absolute top-[9px] left-2.5 w-3.5 h-3.5"
              alt="Icon"
              src="/figmaAssets/icon-11.svg"
            />
          </div>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-[10.5px] px-[10.5px] py-0 rounded-[8.75px] h-[45.5px]">
          <div
            className="w-[31.5px] h-[31.5px] rounded-full border-2 border-solid border-[#00bba6] flex-shrink-0"
            style={{
              background:
                "url(/figmaAssets/image--dr--sarah-johnson-.png) 50% 50% / cover",
            }}
          />
          <div className="flex flex-col items-start">
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#101828] text-[12.2px] tracking-[-0.02px] leading-[15.3px] whitespace-nowrap">
              Dr. Sarah Johnson
            </span>
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#6a7282] text-[10.5px] tracking-[0.09px] leading-[13.1px] whitespace-nowrap">
              Doctor
            </span>
          </div>
          <img
            className="w-3.5 h-3.5 flex-shrink-0"
            alt="Icon"
            src="/figmaAssets/container.svg"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col w-full items-start pt-[21px] pb-0 px-[21px] flex-1 bg-gray-50">
        <div className="flex flex-col items-start gap-3.5 w-full flex-1">
          {/* Breadcrumb */}
          <Card className="w-full bg-white rounded-[8.75px] border border-solid border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
            <CardContent className="flex items-center gap-[7px] px-[22px] py-[11.5px]">
              <img
                className="w-3.5 h-3.5 flex-shrink-0"
                alt="Icon"
                src="/figmaAssets/icon-5.svg"
              />
              <span className="[font-family:'Inter',Helvetica] font-normal text-[#4a5565] text-[13px] tracking-[0] leading-[19.5px] whitespace-nowrap">
                Calendar
              </span>
              <img
                className="w-3.5 h-3.5 flex-shrink-0"
                alt="Icon"
                src="/figmaAssets/icon-3.svg"
              />
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#101828] text-[13px] tracking-[0] leading-[19.5px] whitespace-nowrap">
                My Schedule
              </span>
            </CardContent>
          </Card>

          {/* Schedule Controls + Stats */}
          <Card className="w-full bg-white rounded-[8.75px] border border-solid border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
            <CardContent className="flex flex-col gap-[10.5px] pt-[11.5px] pb-px px-[11.5px]">
              {/* Controls Row */}
              <div className="flex items-center justify-between w-full h-[42px]">
                {/* Left spacer */}
                <div className="flex-1" />

                {/* Date Navigation */}
                <div className="flex items-center gap-3.5">
                  <img
                    className="w-[31.5px] h-[24.5px] cursor-pointer"
                    alt="Previous"
                    src="/figmaAssets/button.svg"
                  />
                  <div className="flex flex-col items-start">
                    <span className="[font-family:'Helvetica-Regular',Helvetica] font-normal text-[#101828] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                      Monday
                    </span>
                    <span className="[font-family:'Inter',Helvetica] font-normal text-[#6a7282] text-xs text-center tracking-[0] leading-[18px] whitespace-nowrap">
                      February 9, 2026
                    </span>
                  </div>
                  <img
                    className="w-[31.5px] h-[24.5px] cursor-pointer"
                    alt="Next"
                    src="/figmaAssets/button-2.svg"
                  />
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end gap-[10.5px] flex-1">
                  {/* Day/Week/Month Toggle */}
                  <div className="flex items-start pt-[1.75px] pb-0 px-[1.75px] bg-gray-100 rounded-[8.75px] h-[33.5px]">
                    {viewOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setActiveView(option)}
                        className={`h-[30px] px-3.5 rounded-[3.5px] [font-family:'Inter',Helvetica] font-medium text-[13px] text-center tracking-[0] leading-[19.5px] whitespace-nowrap transition-colors ${
                          activeView === option
                            ? "bg-sky-700 text-white shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]"
                            : "text-[#4a5565]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Today Button */}
                  <Button
                    className="h-auto flex items-center justify-center gap-[5.25px] px-3.5 py-0 bg-sky-500 rounded-[6.75px] [font-family:'Inter',Helvetica] font-medium text-white text-[13px] text-center tracking-[0] leading-[19.5px] whitespace-nowrap hover:bg-sky-600"
                    style={{ height: "24.5px" }}
                  >
                    Today
                  </Button>

                  {/* Filter icon */}
                  <img
                    className="w-[17.5px] h-[17.5px] cursor-pointer"
                    alt="Filter"
                    src="/figmaAssets/container-6.svg"
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-[7px] w-full">
                {statsData.map((stat) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col flex-1 items-start pt-2 pb-px px-2 h-14 ${stat.bg} rounded-[8.75px] border border-solid ${stat.border}`}
                  >
                    <span
                      className={`[font-family:'Helvetica-Regular',Helvetica] font-normal text-[17.5px] tracking-[0] leading-[24.5px] whitespace-nowrap ${stat.valueColor}`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`[font-family:'Inter',Helvetica] font-normal text-[10px] tracking-[0] leading-[15px] whitespace-nowrap ${stat.labelColor}`}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointments Table */}
          <Card className="w-full bg-white rounded-[8.75px] border border-solid border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] overflow-hidden flex-1">
            <CardContent className="p-px flex flex-col">
              {appointments.map((appt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-[10.5px] px-[10.5px] py-0 h-[49.5px] border-b border-solid border last:border-b-0"
                >
                  {/* Expand icon */}
                  <img
                    className="w-[17.5px] h-3.5 flex-shrink-0"
                    alt="Expand"
                    src="/figmaAssets/container.svg"
                  />

                  {/* Time + Duration */}
                  <div className="flex flex-col items-start w-14 flex-shrink-0">
                    <span className="[font-family:'Helvetica-Regular',Helvetica] font-normal text-[#101828] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                      {appt.time}
                    </span>
                    <span className="[font-family:'Inter',Helvetica] font-normal text-[#6a7282] text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
                      {appt.duration}
                    </span>
                  </div>

                  {/* Patient Avatar + Name */}
                  <div className="flex items-center gap-[7px] w-[168px] flex-shrink-0">
                    <div className="flex w-7 h-7 items-center justify-center rounded-full shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] bg-[linear-gradient(135deg,rgba(81,162,255,1)_0%,rgba(21,93,252,1)_100%)] flex-shrink-0">
                      <span className="[font-family:'Helvetica-Regular',Helvetica] font-normal text-white text-[11px] tracking-[0] leading-[16.5px] whitespace-nowrap">
                        {appt.initials}
                      </span>
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <span className="[font-family:'Helvetica-Regular',Helvetica] font-normal text-[#101828] text-[13px] tracking-[0] leading-[19.5px] whitespace-nowrap">
                        {appt.name}
                      </span>
                      <span className="[font-family:'Inter',Helvetica] font-normal text-[#6a7282] text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
                        {appt.ageGender}
                      </span>
                    </div>
                  </div>

                  {/* Visit Type */}
                  <div className="w-[98px] flex-shrink-0">
                    <span className="[font-family:'Inter',Helvetica] font-medium text-[#101828] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                      {appt.visitType}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <span className="[font-family:'Inter',Helvetica] font-normal text-[#364153] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                      {appt.description}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex-shrink-0 px-2 py-[3px] rounded-[3.5px] border border-solid ${statusConfig[appt.status].bg} ${statusConfig[appt.status].border}`}
                  >
                    <span
                      className={`[font-family:'Inter',Helvetica] font-medium text-[10px] tracking-[0] leading-[15px] whitespace-nowrap ${statusConfig[appt.status].text}`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-[5.25px] w-[84px] flex-shrink-0">
                    <LocationIcon type={appt.locationType} />
                    <span className="[font-family:'Inter',Helvetica] font-medium text-[#4a5565] text-[11px] tracking-[0] leading-[16.5px] whitespace-nowrap">
                      {appt.location}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
