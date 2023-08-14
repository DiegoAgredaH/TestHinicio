import { Icons } from "../ui/Icons";
import { Input } from "../ui/Input";

export const Search = () => {
  return (
    <div className="relative mb-4">
      <Input
        type="search"
        placeholder="Search Element..."
        className="py-2 pl-10 "
      />
      <span className="absolute left-2 top-2 text-gray-400">
        <Icons.search />
      </span>
    </div>
  );
};
