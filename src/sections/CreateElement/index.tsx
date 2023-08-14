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
import { Input } from "../../components/ui/Input";
import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useApi } from "../../hooks/useApi";
import { setEnergySystem } from "../../store/slices/EnergySystem/systemSlice";
import { useToast } from "../../components/ui/use-toast";

export const CreateElement = () => {
  const dispatch = useAppDispatch();
  const systemProperties = useAppSelector((state) => state.energySystem);
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);
  const [propertyInputs, setPropertyInputs] = useState([
    { property: "", value: "" },
  ]);
  const [elementName, setElementName] = useState("");
  const { data, error, fetchData } = useApi();
  const { toast } = useToast();

  // Función para agregar una nueva propiedad
  const addProperty = () => {
    setPropertyInputs([...propertyInputs, { property: "", value: "" }]);
  };

  const handleCreateElement = () => {
    const updatedListElements = {
      ...editedSystemProperties?.energySystem.Energy_System.list_of_elements,
    };

    const properties = {};

    propertyInputs.map((input) => {
      properties[input.property] = input.value;
    });

    updatedListElements[elementName] = properties;

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
    if (data) {
      if (JSON.stringify(data) === `{"updated":"True"}`) {
        fetchData("GET", { id: 0 });
      } else {
        dispatch(setEnergySystem({ energySystem: data }));
        setPropertyInputs([{ property: "", value: "" }]);
        setElementName("");
        toast({
          title: "Success !!!",
          description: `The element "${elementName}" has been created.`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setEditedSystemProperties(systemProperties);
  }, [systemProperties]);

  if (error) {
    return <h1>Ocurrio un error en la peticion</h1>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 text-black font-bold">
          Create Element
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Element</DialogTitle>
          <DialogDescription>Create and add new properties.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              defaultValue={elementName}
              placeholder={"Element name:"}
              onChange={(e) => {
                setElementName(e.target.value);
              }}
            />
            {propertyInputs.map((input, index) => (
              <div key={index} className="mt-2 mr-4 flex items-center">
                <Input
                  type="text"
                  defaultValue={input.property}
                  placeholder={"Property:"}
                  onChange={(e) => {
                    const updatedInputs = [...propertyInputs];
                    updatedInputs[index].property = e.target.value;
                    setPropertyInputs(updatedInputs);
                  }}
                />
                <Input
                  type="text"
                  defaultValue={input.value}
                  placeholder={"Value"}
                  onChange={(e) => {
                    const updatedInputs = [...propertyInputs];
                    updatedInputs[index].value = e.target.value;
                    setPropertyInputs(updatedInputs);
                  }}
                />
              </div>
            ))}
            <ScrollBar orientation="vertical"></ScrollBar>
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="space-x-2">
            <Close asChild>
              <Button onClick={handleCreateElement}>Save Element</Button>
            </Close>
            <Button className="bg-blue-400" onClick={addProperty}>
              Add Property
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
