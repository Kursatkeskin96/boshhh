"use client";
import Form from "@/components/Form";
import Forms from "@/components/Forms";
import Image from "next/image";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="lg:bg-[#f1f1f1] ">
        {/* <Form /> */}
        <Forms />
      </div>
    </Provider>
  );
}
