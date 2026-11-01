import {
  getChokepoints,
  getCases,
  getAsks,
  getCountrySummaries,
  getCouldNotScreen,
} from '@/lib/data';
import MainDashboard from '@/components/MainDashboard';

export const revalidate = false; // Completely static build

export default function Home() {
  const chokepoints = getChokepoints();
  const cases = getCases();
  const asks = getAsks();
  const countries = getCountrySummaries();
  const unscreenable = getCouldNotScreen();

  const metrics = {
    totalScored: chokepoints.length, // 35
    countriesCount: countries.length, // 8
    replaceGt5Count: chokepoints.filter((cp) => cp.time_to_replace === 'high').length, // 8
    depHighCount: chokepoints.filter((cp) => cp.dependence_on_target === 'high').length, // 32
  };

  return (
    <MainDashboard
      chokepoints={chokepoints}
      cases={cases}
      asks={asks}
      countries={countries}
      unscreenable={unscreenable}
      metrics={metrics}
    />
  );
}
