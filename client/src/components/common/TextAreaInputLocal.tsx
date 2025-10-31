interface TextAreaInputLocalProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
  optional?: boolean;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}

const TextAreaInputLocal: React.FC<TextAreaInputLocalProps> = ({
  label,
  optional,
  note,
  setNote,
  ...rest
}) => (
  <div className="flex flex-col gap-1 flex-grow">
    <label className="text-sm font-semibold">
      {label}{" "}
      {optional && (
        <span className="font-normal text-gray-400">(optional)</span>
      )}
    </label>
    <textarea
      {...rest}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      className="text-sm outline-1 w-full rounded-lg pl-2 pt-2 resize-none flex-grow min-h-[6rem] transition-all duration-200 outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1"
    />
  </div>
);

export default TextAreaInputLocal;
