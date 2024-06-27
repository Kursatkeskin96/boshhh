"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addHiddenData } from "@/app/store/slices/hiddenSlice";

const Dropdown = ({ options }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("plan");

  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hiddenValues, setHiddenValues] = useState({
    plan_price: "0.00",
    id: options[1]?.id || "",
    price: options[1]?.Price || "",
    sku: options[1]?.Sku || "",
    name: options[1]?.Name || "",
  });

  const dispatch = useDispatch();
  const toggleDropdown = () => setOpen(!isOpen);

  useEffect(() => {
    dispatch(addHiddenData(hiddenValues));
  }, []);

  const handleItemClick = (id, item) => {
    setSelectedItem(id);
    setOpen(false);
    const updatedHiddenValues = {
      plan_price: "0.00",
      id: item.id,
      price: item.Price,
      sku: item.Sku,
      name: item.Name,
    };
    setHiddenValues(updatedHiddenValues);
    dispatch(addHiddenData(updatedHiddenValues));
  };

  const searchItems = options?.map((item) => item.sku);

  return (
    <div className="dropdown bg-white">
      <input type="hidden" name="plan-price" value={hiddenValues?.plan_price} />
      <input type="hidden" name="id" value={hiddenValues?.id} />
      <input type="hidden" name="name" value={hiddenValues?.name} />
      <input type="hidden" name="price" value={hiddenValues?.price} />
      <input type="hidden" name="sku" value={hiddenValues?.sku} />
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="flex gap-2 items-center">
          <div className="">
            <img
              src="https://cdn.shopify.com/s/files/1/0670/4608/0724/files/boshhh-sim_1.png?v=1718884195"
              alt="logo"
              className="w-full h-[30px]"
            />
          </div>

          <div className="text-[18px] font-bold">
            {searchItems?.includes(search) || selectedItem !== null
              ? options?.find(
                  (item) => item.Sku === search || selectedItem === item.id
                )?.Name
              : options !== undefined && options[1]?.Name}
          </div>
        </div>

        <div className="flex">
          <span className="text-[#c94090]">Change</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`w-6 h-6 text-red-600 inline-block float-right transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className={`dropdown-body ${isOpen ? "open" : ""}`}>
        {options?.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id, item)}
            className="flex justify-between items-center cursor-pointer px-4 py-1 hover:bg-gray-100 border-t"
          >
            <div className="dropdown-item ">
              <input
                type="radio"
                className="mr-3"
                checked={selectedItem === item.id}
                id={item.id}
                onChange={() => handleItemClick(item.id, item)}
              />
              <label htmlFor={item.id}>{item.Name}</label>
            </div>
            <div>£{item.Price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
