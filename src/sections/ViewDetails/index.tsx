import { Button } from "../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Close } from "@radix-ui/react-dialog";
import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Icons } from "../../components/ui/Icons";

interface Props {
  [key: string]: string | boolean | number | null;
  name: string;
}

export const ViewDetails = ({ properties, name }: Props) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredElements, setFilteredElements] = useState({});

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterElements = (
    elements: Record<string, unknown>,
    searchTerm: string
  ) => {
    const filteredElements = {};

    for (const key in elements) {
      if (key.includes(searchTerm)) {
        filteredElements[key] = elements[key];
      }
    }
    setFilteredElements(filteredElements);
  };

  useEffect(() => {
    if (properties) {
      filterElements(
        properties,
        searchTerm
      );
    }
    // eslint-disable-next-line
  }, [properties, searchTerm]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full h-full rounded-lg rounded-t-none bg-gray-200 text-black font-bold hover:bg-blue-950 hover:text-white hover:font-bold"
        >
          <p>View more ...</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit '{name}'</DialogTitle>
          <DialogDescription>
            Make the changes to the elements properties here
          </DialogDescription>
        </DialogHeader>
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
        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 py-4">
            {Object.entries(filteredElements).map(([key, value]) => (
              <div key={key} className="mt-2 flex items-center">
                <p className="font-bold text-blue-800 mr-2">{key}:</p>
                <p>{value?.toString()}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>
        <DialogFooter>
          <Close asChild>
            <Button type="submit">Close</Button>
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
