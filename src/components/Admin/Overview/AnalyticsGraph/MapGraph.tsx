import { Chart } from "chart.js";
import * as ChartGeo from "chartjs-chart-geo";
import {
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
} from "chartjs-chart-geo";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { AppState } from "../../../../store";
import { getLocaleId, worldAtlasData } from "./map";

Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

const MapGraph = ({ data }: { data: any }) => {
  const dateRange = useAppSelector(
    (state: AppState) => state.admin.overview.dateRange
  );
  const countries = useMemo(
    () =>
      ChartGeo.topojson.feature(
        worldAtlasData,
        worldAtlasData.objects.countries
      ).features,
    []
  );
  const dataConfig = {
    labels: countries.map((d) => d.properties.name),
    datasets: [
      {
        label: "Countries",
        data: countries.map((d) => ({
          feature: d,
          value: data?.[getLocaleId(d.properties.name)] ?? 0,
        })),
      },
    ],
  };
  const config = {
    type: "choropleth",
    data: dataConfig,
    options: {
      showOutline: true,
      showGraticule: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        projection: {
          axis: "x",
          projection: "equalEarth",
        },
      },
    },
  };

  useEffect(() => {
    const canvasHtml: any = document.getElementById("map-graph");
    const chart = new Chart(canvasHtml?.getContext("2d"), config);
    return () => {
      chart.destroy();
    };
  }, [dateRange]);

  return <canvas id="map-graph"></canvas>;
};

export default MapGraph;
