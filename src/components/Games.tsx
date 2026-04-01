import { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Gamepad2, Grid3X3, ArrowRight } from "lucide-react";
import { TicTacToe } from "./TicTacToe";
import { Snake } from "./Snake";

export function Games() {
  const [activeTab, setActiveTab] = useState("tic-tac-toe");

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full p-4 border border-default-200 bg-content1 shadow-lg">
        <CardBody className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Gamepad2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Mini Games Zone
              </h2>
              <p className="text-default-500 text-sm">
                Take a break and challenge yourself with some quick games!
              </p>
            </div>
          </div>

          <Tabs
            aria-label="Games"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#22d3ee]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#06b6d4]"
            }}
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab
              key="tic-tac-toe"
              title={
                <div className="flex items-center space-x-2">
                  <Grid3X3 size={20} />
                  <span>Tic-Tac-Toe</span>
                </div>
              }
            >
              <div className="mt-8 py-4">
                <TicTacToe />
              </div>
            </Tab>
            <Tab
              key="snake"
              title={
                <div className="flex items-center space-x-2">
                  <ArrowRight size={20} />
                  <span>Snake</span>
                </div>
              }
            >
              <div className="mt-8 py-4">
                <Snake />
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
