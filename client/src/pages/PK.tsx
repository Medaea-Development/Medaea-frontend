import { ScheduleManagementSection } from "./sections/ScheduleManagementSection";
import { SideNavigationSection } from "./sections/SideNavigationSection";

export const PK = (): JSX.Element => {
  return (
    <div className="flex w-full min-h-screen items-start bg-gray-50">
      <SideNavigationSection />
      <ScheduleManagementSection />
    </div>
  );
};
