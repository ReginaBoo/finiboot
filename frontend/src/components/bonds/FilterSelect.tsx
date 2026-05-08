import { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi2";

interface Option {
  id: string | number;
  name: string;
}

interface FilterSelectProps {
  options: Option[];
  selectedValue: string | number;
  onSelect: (value: any) => void;
  placeholder?: string;
}

export function FilterSelect({ options, selectedValue, onSelect, placeholder = "Выберите" }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find(opt => opt.id === selectedValue);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border border-[#775B96] rounded-full cursor-pointer bg-transparent hover:bg-[#5a3480] transition-all duration-200"
        >
          <span className={`text-sm ${activeOption ? "text-white" : "text-fuchsia-200/50"}`}>
            {placeholder}
          </span>
          <HiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 py-2 bg-[#331B4C] border border-fuchsia-400/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-track]:my-2
            [&::-webkit-scrollbar-thumb]:bg-white/80
            [&::-webkit-scrollbar-thumb]:rounded-full
           ">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${selectedValue === opt.id ? 'bg-[#5a3480] text-white font-semibold' : 'hover:bg-[#482A69] text-fuchsia-100'
                  }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}