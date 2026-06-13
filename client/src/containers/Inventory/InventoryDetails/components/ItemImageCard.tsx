import { ImagePlus, Trash2 } from "lucide-react";

interface ItemImageCardProps {
  imageUrl?: string;
  onUpload: (file: File) => void;
}

const ItemImageCard: React.FC<ItemImageCardProps> = ({
  imageUrl,
  onUpload,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Media</h3>

      {imageUrl ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden group">
          <img
            src={imageUrl}
            alt="Item"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
              Change Image
            </button>
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-600">
            Click to upload an image
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      )}
    </div>
  );
};

export default ItemImageCard;
