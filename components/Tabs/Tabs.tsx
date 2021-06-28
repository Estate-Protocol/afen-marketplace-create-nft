import { ReactNode, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export interface TabsComponentProps {
  tabs: {
    title: string;
    body: ReactNode | null;
    disabled?: boolean;
  }[];
}

export default function TabsComponent({ tabs }: TabsComponentProps) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      className="mt-2"
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
    >
      <TabList className="border-none bg-opacity-100">
        {tabs.map(({ title, disabled }, index) => (
          <Tab
            disabled={disabled}
            key={index}
            className={`text-gray-400 list-none inline-block pr-5 mr-8 cursor-pointer dark:focus:text-white pb-1 transition-colors duration-75 ease-linear text-sm focus:outline-none font-bold ${
              tabIndex === index
                ? "dark:text-afen-yellow border-b-2 border-black dark:border-afen-yellow"
                : ""
            }`}
          >
            {title}
          </Tab>
        ))}
      </TabList>
      {tabs.map(({ body }, index) => (
        <TabPanel key={index} className={"mt-2 mb-2"}>
          {body}
        </TabPanel>
      ))}
    </Tabs>
  );
}
