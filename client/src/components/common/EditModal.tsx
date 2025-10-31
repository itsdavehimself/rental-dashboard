interface EditModalProps {
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      {children}
    </div>
  );
};

export default EditModal;
