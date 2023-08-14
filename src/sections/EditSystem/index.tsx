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
  [key: string]:
    | boolean
    | string
    | number
    | null
    | Record<string, boolean | string | number | null>;
}

export const EditSystem = () => {
  const systemProperties = useAppSelector((state) => state.energySystem);
  const dispatch = useAppDispatch();
  const { data, error, fetchData } = useApi();
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);

  const energySystemProperties: EnergySystemProperties =
    systemProperties.energySystem.Energy_System || {};

  const filteredProperties = Object.keys(energySystemProperties).filter(
    (key) => key !== "list_of_elements"
  );

  const { toast } = useToast();

  const handleSystemPropertyChange = (
    propertyKey: string,
    value: string | boolean | number
  ) => {
    const updatedEnergySystem = {
      ...editedSystemProperties?.energySystem.Energy_System,
      [propertyKey]: value,
    };

    setEditedSystemProperties({
      energySystem: { Energy_System: updatedEnergySystem },
    });
  };

  const handleSubmit = () => {
    fetchData(
      "PUT",
      {},
      JSON.stringify({ id: 0, data: editedSystemProperties?.energySystem })
    );
  };

  useEffect(() => {
    setEditedSystemProperties(systemProperties);
  }, [systemProperties]);

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
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>

        <DialogFooter>
          <Close asChild>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
