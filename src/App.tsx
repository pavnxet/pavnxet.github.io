import { Tabs, Tab } from "@heroui/react";
import { Sidebar } from "./components/Sidebar";
import { Projects } from "./components/Projects";
import { MusicPlayer } from "./components/MusicPlayer";
import { Games } from "./components/Games";
import { FolderGit2, Music, Gamepad2 } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row p-4 md:p-8 gap-6 md:h-screen w-full max-w-[1600px] mx-auto overflow-hidden">
      <aside className="w-full md:w-[320px] lg:w-[380px] shrink-0 h-auto md:h-full overflow-y-auto rounded-xl scrollbar-hide">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col h-full bg-content1/30 rounded-xl overflow-hidden border border-default-100 shadow-sm backdrop-blur-md">
        <Tabs
          aria-label="Dashboard Sections"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-4 border-b border-default-200",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-2 h-12",
            tabContent:
              "group-data-[selected=true]:text-primary group-data-[selected=true]:font-bold transition-all text-default-500",
          }}
        >
          <Tab
            key="projects"
            title={
              <div className="flex items-center space-x-2">
                <FolderGit2 size={20} />
                <span>Deployed Projects</span>
              </div>
            }
          >
            <div className="p-4 h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
              <Projects />
            </div>
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <Music size={20} />
                <span>Music Player</span>
              </div>
            }
          >
            <div className="p-4 h-[calc(100vh-140px)] flex items-center justify-center overflow-y-auto scrollbar-hide">
              <MusicPlayer />
            </div>
          </Tab>
          <Tab
            key="games"
            title={
              <div className="flex items-center space-x-2">
                <Gamepad2 size={20} />
                <span>Mini Games</span>
              </div>
            }
          >
            <div className="p-4 h-[calc(100vh-140px)] flex items-center justify-center overflow-y-auto scrollbar-hide">
              <Games />
            </div>
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}
