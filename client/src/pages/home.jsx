import { fetchApiHealth } from "@/services/api/fetch.js";
import { useQuery } from "@tanstack/react-query";

/**
 * @typedef {{ data: ApiResponse }} ApiHealthData
 */

export const Home = () => {
  /** @type {ApiHealthData} */
  const { data } = useQuery({
    queryKey: ["apiHealth"],
    queryFn: fetchApiHealth,
    refetchInterval: 1
  });

  return data && (
    <>
      <div>success: {data.success.toString()}</div>
      <div>message: {data.message}</div>
      {Object.entries(data.data).map(([k, v]) => (
        <div key={k}>{k}: {v}</div>
      ))}
    </>
  );
};
