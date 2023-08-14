import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Error, Footer, Header } from "../../components";
import { ElementsList } from "../ElementsList";
import { setEnergySystem } from "../../store/slices/EnergySystem/systemSlice";
import { useApi } from "../../hooks/useApi";
import { EnergySystem } from "../EnergySystem";

export const Home = () => {
  // Dispatch function from Redux
  const dispatch = useDispatch();

  // Custom API hook for fetching data
  const { data, loading, error, fetchData } = useApi();

  // Get data and asign to global state
  useEffect(() => {
    if (data) {
      dispatch(setEnergySystem({ energySystem: data }));
    } else {
      fetchData("GET", { id: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <Error />;
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-blue-500 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col sm:flex-row h-full m-2 rounded-xl">
              <EnergySystem />
              <ElementsList />
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};
