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

interface Props {
  [key: string]: string | boolean | number | null;
  name: string;
}

export const EditElement = ({ properties, name }: Props) => {
  const systemProperties = useAppSelector((state) => state.energySystem);
  const dispatch = useAppDispatch();
  const { data, error, fetchData } = useApi();
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);
  const [elementProperties, setElementProperties] = useState(properties);

  const { toast } = useToast();

  const handleSystemPropertyChange = (
    propertyKey: string,
    value: string | boolean | number
  ) => {
    const updatedProperties = {
      ...elementProperties,
      [propertyKey]: value,
    };

    setElementProperties(updatedProperties);

    const updatedListElements = {
      ...editedSystemProperties?.energySystem.Energy_System.list_of_elements,
      [name]: updatedProperties,
    };
    const updatedEnergySystem = {
      ...editedSystemProperties?.energySystem.Energy_System,
      list_of_elements: updatedListElements,
    };

    console.log("updatedListElements", updatedListElements);

    setEditedSystemProperties({
      energySystem: { Energy_System: updatedEnergySystem },
    });
  };

  const handleSubmit = () => {
    console.log("PUT", editedSystemProperties?.energySystem);
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
          description: "The element properties have been updated.",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <h1>Ocurrio un error en la peticion</h1>;
  }

  const elementProps = properties || {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="icon" className="h-6 w-6">
          <Icons.edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit '{name}'</DialogTitle>
          <DialogDescription>
            Make the changes to the elements properties here
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 py-4">
            {Object.entries(elementProps).map(([key, value]) => (
              <div key={key} className="mt-2 mr-4 flex items-center">
                <p className="font-bold text-blue-800 mr-2">{key}:</p>
                <Input
                  type={typeof value === "number" ? "number" : "text"}
                  defaultValue={value?.toString()}
                  placeholder={value?.toString()}
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