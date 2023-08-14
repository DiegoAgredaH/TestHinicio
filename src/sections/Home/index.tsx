import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Footer, Header } from "../../components";
import { ElementsList } from "../ElementsList";
import { setEnergySystem } from "../../store/slices/EnergySystem/systemSlice";
import { useApi } from "../../hooks/useApi";
import { EnergySystem } from "../EnergySystem";

export const Home = () => {
  const dispatch = useDispatch();
  const { data, loading, error, fetchData } = useApi();

  useEffect(() => {
    if (data) {
      dispatch(setEnergySystem({ energySystem: data }));
    } else {
      fetchData("GET", { id: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <h1>Ocurrio un error en la peticion</h1>;
  }

  return (
    <>
      {loading ? (
        <div>Cargando ....</div>
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
