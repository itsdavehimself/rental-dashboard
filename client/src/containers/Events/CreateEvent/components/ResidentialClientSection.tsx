interface ResidentialClientSectionProps {
  title: string;
  children: React.ReactNode;
  lastItem?: boolean;
}

const ResidentialClientSection: React.FC<ResidentialClientSectionProps> = ({
  title,
  children,
  lastItem,
}) => {
  return (
    <>
      <h5 className="font-semibold mt-6">{title}</h5>
      <div className={`flex flex-col text-sm mt-4 ${!lastItem && "mb-6"}`}>
        {children}
      </div>
      {!lastItem && <hr className="text-gray-200" />}
    </>
  );
};

export default ResidentialClientSection;
