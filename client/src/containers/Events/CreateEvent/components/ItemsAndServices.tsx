import DebouncedSearchBar from "../../../../components/common/DebouncedSearchBar";

const ItemsAndServices: React.FC = () => {
  return (
    <div className="flex flex-col flex-grow gap-4 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <h4 className="font-semibold text-lg">Items & Services</h4>
      <div className="flex flex-col justify-center">
        <DebouncedSearchBar placeholder="Search" />
      </div>
    </div>
  );
};

export default ItemsAndServices;
