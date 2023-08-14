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
import { Icons } from "../../components/ui/Icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import {
  InitialState,
  setEnergySystem,
} from "../../store/slices/EnergySystem/systemSlice";
import { useApi } from "../../hooks/useApi";
import { Close } from "@radix-ui/react-dialog";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/use-toast";
import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";

interface EnergySystemProperties {
  [key: string]: {
    [key: string]:
      | boolean
      | string
      | number
      | null
      | Record<string, boolean | string | number | null>;
  } | number | boolean | string | null;
}

export const EditSystem = () => {
  // Get the system properties from Redux state
  const systemProperties = useAppSelector((state) => state.energySystem);

  // Dispatch function from Redux
  const dispatch = useAppDispatch();

  // Custom API hook for fetching data
  const { data, error, fetchData } = useApi();

  // State for edited system properties
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);

  const energySystemProperties: EnergySystemProperties =
    editedSystemProperties.energySystem.Energy_System || {};

  // Filter out properties that shouldn't be displayed (e.g., "list_of_elements")
  const filteredProperties = Object.keys(energySystemProperties).filter(
    (key) => key !== "list_of_elements"
  );

  // Custom toast hook
  const { toast } = useToast();

  // Function to handle changes in system properties
  const handleSystemPropertyChange = (
    propertyKey: string,
    value: string | boolean | number
  ) => {
    // Update the editedSystemProperties with the modified property
    const updatedEnergySystem = {
      ...editedSystemProperties?.energySystem.Energy_System,
      [propertyKey]: value,
    };

    setEditedSystemProperties({
      energySystem: { Energy_System: updatedEnergySystem },
    });
  };

  // Function to PUT request to the API with the system properties updated
  const handleEditSystem = () => {
    fetchData(
      "PUT",
      {},
      JSON.stringify({ id: 0, data: editedSystemProperties?.energySystem })
    );
  };

  // Function to handle property deletion
  const handleDelete = (key: string) => {
    
    const updatedListElements = {
      ...editedSystemProperties?.energySystem.Energy_System,
    };

    if (updatedListElements) {
      delete updatedListElements[key];
    }

    const updatedEnergySystem = {
      ...editedSystemProperties?.energySystem,
      Energy_System: updatedListElements,
    };

    setEditedSystemProperties({
      energySystem: updatedEnergySystem,
    });
  };

  // Update editedSystemProperties when the Redux state changes
  useEffect(() => {
    setEditedSystemProperties(systemProperties);
  }, [systemProperties]);

  // Handle API responses
  useEffect(() => {
    if (data) {
      if (JSON.stringify(data) === `{"updated":"True"}`) {
        fetchData("GET", { id: 0 });
      } else {
        dispatch(setEnergySystem({ energySystem: data }));
        toast({
          title: "Success !!!",
          description: "The system properties have been updated.",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <h1>Ocurrio un error en la peticion</h1>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="m-8">
          <Icons.edit className="mr-2 h-4 w-4" /> Edit System
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit System</DialogTitle>
          <DialogDescription>
            Make the changes to the system properties here
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 py-4">
            {filteredProperties.map((key) => (
              <div key={key} className="mt-2 flex items-center mr-4">
                <p className="font-bold text-blue-800 mr-2">{key}:</p>
                <Input
                  type={
                    typeof energySystemProperties[key] === "number"
                      ? "number"
                      : "text"
                  }
                  defaultValue={energySystemProperties[key]?.toString()}
                  placeholder={energySystemProperties[key]?.toString()}
                  onChange={(e) =>
                    handleSystemPropertyChange(key, e.target.value)
                  }
                />
                <Button
                  variant="default"
                  className="hover:bg-blue-400 bg-transparent text-black h-6 w-6 m-2"
                  size="icon"
                  onClick={() => handleDelete(key)}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>

        <DialogFooter>
          <Close asChild>
            <Button onClick={handleEditSystem}>Save changes</Button>
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
