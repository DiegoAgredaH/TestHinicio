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
import { useToast } from "../../components/ui/use-toast";

interface Props {
  [key: string]: string | boolean | number | null;
  name: string;
}

export const DeleteElement = ({ name }: Props) => {
  // Get the system properties from Redux state
  const systemProperties = useAppSelector((state) => state.energySystem);

  // Dispatch function from Redux
  const dispatch = useAppDispatch();

  // Custom API hook for fetching data
  const { data, error, fetchData } = useApi();

  // State for edited system properties
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);

  // Custom toast hook
  const { toast } = useToast();

  // Function to handle element deletion
  const handleDelete = () => {
    const updatedListElements = {
      ...editedSystemProperties?.energySystem.Energy_System.list_of_elements,
    };
    
    if (updatedListElements) {
      delete updatedListElements[name];
    }

    // Construct updatedEnergySystem and send a PUT request to the API
    const updatedEnergySystem = {
      ...editedSystemProperties?.energySystem.Energy_System,
      list_of_elements: updatedListElements,
    };

    fetchData(
      "PUT",
      {},
      JSON.stringify({ id: 0, data: { Energy_System: updatedEnergySystem } })
    );
  };

  useEffect(() => {
    setEditedSystemProperties(systemProperties);
  }, [systemProperties]);

  // Handle API responses and errors
  useEffect(() => {
    if (data) {
      if (JSON.stringify(data) === `{"updated":"True"}`) {
        fetchData("GET", { id: 0 });
      } else {
        dispatch(setEnergySystem({ energySystem: data }));
        toast({
          title: "Success !!!",
          description: `The element "${name}" has been deleted.`,
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
        <Button
          variant="default"
          className="bg-blue-400 text-black h-6 w-6"
          size="icon"
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Delete '{name}'</DialogTitle>
          <DialogDescription>Are you sure to remove {name}?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Close asChild>
            <div className="space-x-2">
              <Button type="submit" onClick={handleDelete}>
                Yes
              </Button>
              <Button type="submit" className="bg-blue-400">
                No
              </Button>
            </div>
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
