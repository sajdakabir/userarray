import SettingsSidebar from "@/views/settings/sidebar/SettingsSidebar";

const SlugLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SettingsSidebar />
      {children}
    </>
  );
};

export default SlugLayout;
