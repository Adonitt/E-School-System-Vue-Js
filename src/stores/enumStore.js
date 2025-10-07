import { defineStore } from "pinia";
import { ref } from "vue";
import { useLoading } from "@/composables/useLoading.js";
import EnumService from "@/services/enumService.js";

export const useEnumStore = defineStore("enumStore", () => {
    const countries = ref([]);
    const cities = ref([]);
    const { isLoading, withLoading } = useLoading();

    const loadCountries = async () => {
        await withLoading(async () => {
            try {
                const data = await EnumService.getCountries();
                countries.value = data.map(c => ({ label: c, value: c }));
            } catch (error) {
                console.error("Error loading countries:", error);
            }
        });
    };

    const loadCities = async (country) => {
        if (!country) {
            cities.value = [];
            return;
        }
        await withLoading(async () => {
            try {
                const data = await EnumService.getCities(country);
                cities.value = data.map(c => ({ label: c, value: c }));
            } catch (error) {
                console.error("Error loading cities:", error);
            }
        });
    };

    const clearCities = () => {
        cities.value = [];
    };

    return {
        countries,
        cities,
        isLoading,
        loadCountries,
        loadCities,
        clearCities
    };
});
