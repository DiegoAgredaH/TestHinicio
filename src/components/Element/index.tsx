import { DeleteElement } from "../../sections/DeleteEleement";
import { EditElement } from "../../sections/EditElement";
import { ViewDetails } from "../../sections/ViewDetails";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";

interface Props {
  [key: string]: string | boolean | number | null;
  name: string;
}
export const Element = ({ properties, name }: Props) => {
  const elementProps = properties || {};
  return (
    <Card className=" w-full bg-gray-100 mt-8 border border-gray-200">
      <CardHeader className="flex flex-row justify-between p-1 text-black shadow-sm border border-b-gray-200">
        <CardTitle className="ml-4 m-2">{name}</CardTitle>
        <div className="space-x-2">
          <EditElement properties={properties} name={name}/>
          <DeleteElement name={name}/>
        </div>
      </CardHeader>

      <CardContent>
        {Object.entries(elementProps)
          .slice(0, 3)
          .map(([key, value]) => (
            <div key={key} className="mt-2 flex items-center">
              <p className="font-bold text-black mr-2">{key}:</p>
              <p className="text-black">{value as string}</p>
            </div>
          ))}
      </CardContent>
      {Object.entries(elementProps).length > 3 ? (
        <CardFooter className="border-t-gray-200 border flex items-center justify-center text-center space-y-0 p-0 text-black cursor-pointer hover:bg-blue-950 hover:rounded-b-xl hover:text-white">
          <ViewDetails properties={properties} name={name}/>
        </CardFooter>
      ) : (
        <p className="text-gray-100 text-center">{" "}</p>
      )}
    </Card>
  );
};
