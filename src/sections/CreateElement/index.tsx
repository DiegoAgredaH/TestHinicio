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
import {
  InitialState,
  setEnergySystem,
} from "../../store/slices/EnergySystem/systemSlice";
import { useToast } from "../../components/ui/use-toast";
import { Icons } from "../../components/ui/Icons";

type Properties = {
  [prop: string]: number | boolean | string | null;
};

export const CreateElement = () => {
  // Redux dispatch and selector
  const dispatch = useAppDispatch();
  const systemProperties = useAppSelector((state) => state.energySystem);

  // State for edited system properties, property inputs, and element name
  const [editedSystemProperties, setEditedSystemProperties] =
    useState<InitialState>(systemProperties);
  const [propertyInputs, setPropertyInputs] = useState([
    { property: "", value: "" },
  ]);
  const [elementName, setElementName] = useState("");

  // Custom API hook for fetching data
  const { data, error, fetchData } = useApi();

  // Custom toast hook
  const { toast } = useToast();

  // Function to add new property input fields
  const addProperty = () => {
    setPropertyInputs([...propertyInputs, { property: "", value: "" }]);
  };

  const handleDelete = (key: number) => {
    const newPropertyInputs = propertyInputs.filter(
      (_, index) => index !== key
    );
    setPropertyInputs(newPropertyInputs);
  };

  // Function to handle the creation of an element
  const handleCreateElement = () => {
    const updatedListElements = {
      ...editedSystemProperties?.energySystem.Energy_System.list_of_elements,
    };

    const properties: Properties = {};
    propertyInputs.map((input) => {
      properties[input.property] = input.value;
    });

    // Update the list of elements with the new element and properties
    updatedListElements[elementName] = properties;

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

  // Handle API responses and errors
  useEffect(() => {
    if (data) {
      if (JSON.stringify(data) === `{"updated":"True"}`) {
        // If the element is updated, fetch the latest data
        fetchData("GET", { id: 0 });
      } else {
        // Dispatch the updated energy system, reset inputs, and show success toast
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

  // Update editedSystemProperties when the Redux state changes
  useEffect(() => {
    setEditedSystemProperties(systemProperties);
  }, [systemProperties]);

  if (error) {
    return <h1>Ocurrio un error en la peticion</h1>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-400 text-black font-bold">
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
                  className="mr-2"
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
                <Button
                  variant="default"
                  className="hover:bg-blue-400 bg-transparent text-black h-6 w-6 m-2"
                  size="icon"
                  onClick={() => handleDelete(index)}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <ScrollBar orientation="vertical"></ScrollBar>
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="space-x-2">
            <Button className="bg-blue-400" onClick={addProperty}>
              Add Property
            </Button>
            <Close asChild>
              <Button onClick={handleCreateElement}>Save Element</Button>
            </Close>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
