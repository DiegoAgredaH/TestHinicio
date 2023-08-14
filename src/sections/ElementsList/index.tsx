import { Element } from "../../components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";
import { useAppSelector } from "../../store/hooks";
import { Input } from "../../components/ui/Input";
import { Icons } from "../../components/ui/Icons";
import { ChangeEvent, useEffect, useState } from "react";
import { CreateElement } from "../CreateElement";

export const ElementsList = () => {
  const systemProperties = useAppSelector((state) => state.energySystem);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredElements, setFilteredElements] = useState({});

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterElements = (elements: Record<string, unknown>, searchTerm: string) => {
    const filteredElements = {};

    for (const key in elements) {
      if (key.includes(searchTerm)) {
        filteredElements[key] = elements[key];
      }
    }
    setFilteredElements(filteredElements);
  };

  useEffect(() => {
    if (systemProperties.energySystem.Energy_System.list_of_elements) {
      filterElements(
        systemProperties.energySystem.Energy_System.list_of_elements,
        searchTerm
      );
    }
    // eslint-disable-next-line
  }, [systemProperties, searchTerm]);

  useEffect(() => {
    setFilteredElements(
      systemProperties.energySystem.Energy_System.list_of_elements
    );
  }, [systemProperties]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>System Elements</CardTitle>
        <div className="relative mb-4">
          <Input
            type="search"
            placeholder="Search Element..."
            className="py-2 pl-10 "
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="absolute left-2 top-2 text-gray-400">
            <Icons.search />
          </span>
        </div>
        <CreateElement />
      </CardHeader>
      <ScrollArea className="h-[480px]">
        <CardContent className="grid gap-2 sm:grid-cols-3 animate-in slide-in-from-left-80">
          {Object.entries(filteredElements).map(([key, value]) => (
            <Element
              key={key}
              properties={value}
              name={key}
              className="flex-shrink-0 m-2"
            />
          ))}
        </CardContent>
        <ScrollBar orientation="vertical"></ScrollBar>
      </ScrollArea>
    </Card>
  );
};
