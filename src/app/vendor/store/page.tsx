"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/vendor-ui/Modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { City } from "@/interfaces/city";
import getCities from "@/app/actions/city/get-cities";
import { useAuth } from "@/contexts/AuthContext";
import { createStore } from "@/app/actions/store/actions";

interface Store {
  storeName: string;
  cityName: string;
}

const StorePage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [storeData, setStoreData] = useState<Store>({
    storeName: "",
    cityName: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const { user } = useAuth();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    }

    fetchCities();
  }, []);

  const handleCreateStore = async() => {
    if (!storeData.storeName || !storeData.cityName) return;

    setStores((prev) => [...prev, storeData]);
    await createStore({
      storeName: storeData.storeName,
      cityName: storeData.cityName,
      vendorId: user?.id,
    });
    setStoreData({
      storeName: "",
      cityName: "",
    });
    closeModal();
  };

  return (
    <div className="p-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#203A43]">Your Stores</h1>
          <p className="text-sm text-gray-500">
            Manage your stores and locations
          </p>
        </div>

        <Button
          className="bg-[#203A43] text-white hover:bg-[#1B3138]"
          onClick={openModal}
        >
          Create Store
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="flex justify-center items-center h-[300px] border rounded-xl text-gray-500">
          No stores created yet
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-[#203A43]">
                {store.storeName}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                City: {store.cityName}
              </p>

              <Button variant="outline" className="mt-4 w-full">
                Manage Store
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Store"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              className="bg-[#203A43] text-white hover:bg-[#1B3138]"
              onClick={handleCreateStore}
            >
              Create Store
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-2 text-gray-600">Store Name</p>

            <Input
              placeholder="Enter store name"
              value={storeData.storeName}
              onChange={(e) =>
                setStoreData((prev) => ({
                  ...prev,
                  storeName: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <p className="text-sm mb-2 text-gray-600">City</p>

            <Select
              value={storeData.cityName}
              onValueChange={(value) =>
                setStoreData((prev) => ({
                  ...prev,
                  cityName: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StorePage;