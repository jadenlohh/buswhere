"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!value) return;

    router.push(`?search=${value}`);
  };

  return (
    <div className="search-bar">
      <div className="flex items-center text-base bg-white rounded-2xl shadow grow px-5 py-4 mt-5 lg:mt-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          fill="#A7A7A7"
          viewBox="0 0 256 256"
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
        </svg>

        <input
          type="text"
          placeholder="Search Bus Stop"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full ms-2 focus:outline-none placeholder:text-grey placeholder:text-sm"
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
      </div>
    </div>
  );
}