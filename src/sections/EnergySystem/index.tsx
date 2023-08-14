import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";
import { useAppSelector } from "../../store/hooks";
import { EditSystem } from "../EditSystem";

interface EnergySystemProperties {
  [key: string]:
    | boolean
    | string
    | number
    | null
    | Record<string, boolean | string | number | null>;
}

export const EnergySystem = () => {
  const systemProperties = useAppSelector((state) => state.energySystem);

  const energySystemProperties: EnergySystemProperties =
    systemProperties.energySystem.Energy_System || {};

  const filteredProperties = Object.keys(energySystemProperties).filter(
    (key) => key !== "list_of_elements"
  );

  return (
    <div className="w-full sm:w-1/5 m-2 flex flex-col justify-between h-full">
      <div>
        <h1 className="mt-2 font-extrabold text-2xl md:text-3xl text-center">
          Energy System
        </h1>
        <p className="text-lg mt-2 mb-2 text-gray-400 text-center">
          Properties
        </p>
        <ScrollArea className="h-[330px]">
          <div>
            {filteredProperties.map((key) => (
              <div key={key} className="mt-2 flex items-center">
                <p className="font-bold text-blue-800 mr-2">{key}:</p>
                <p> {energySystemProperties[key]?.toString()}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical"></ScrollBar>
        </ScrollArea>
      </div>
      <EditSystem />
    </div>
  );
};
