import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";

// Set BaseURL
// axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
const REACT_APP_BASEURL = "http://localhost:8080";
axios.defaults.baseURL = REACT_APP_BASEURL;

// Custom Fetch Hook
export default function useFetch(query) {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData((pre) => ({ ...pre, isLoading: true }));

                const { username } = !query ? await getUsername() : "";

                const { data, status } = !query
                    ? await axios.get(`/api/v1/user/${username}`)
                    : await axios.get(`/api/v1/${query}`);

                if (status === 200) {
                    setData((pre) => ({
                        ...pre,
                        isLoading: false,
                        status,
                        apiData: data,
                    }));
                } else {
                    setData((pre) => ({
                        ...pre,
                        isLoading: false,
                    }));
                }
            } catch (error) {
                setData((pre) => ({
                    ...pre,
                    isLoading: false,
                    serverError: error,
                }));
            }
        };
        fetchData();
    }, [query]);

    return [getData, setData];
}
